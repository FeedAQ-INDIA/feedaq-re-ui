// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import {supabase} from "@/util/supabase/client";

export async function POST(req) {
    try {
        const formData = await req.formData()
        const files = formData.getAll('files')
        const { pgId, pgRoomId } = req.body
         const meta = req.body;

        const parsedMeta = Object.keys(meta)
            .filter(key => key.startsWith('meta['))
            .reduce((acc, key) => {
                const match = key.match(/meta\[(\d+)\]\[(.+)\]/)
                if (match) {
                    const [_, index, field] = match
                    acc[index] = acc[index] || {}
                    acc[index][field] = meta[key]
                }
                return acc
            }, {})

        console.log('Reached POST')

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'No files uploaded' }, { status: 400 })
        }

        const urls = []
        let pgAttachList = []
        for (const file of files) {
            const arrayBuffer = await file.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)
            console.log(buffer)
            const ext = file.name.split('.').pop()
            const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

            const { error } = await supabase.storage
                .from('pg-colive')
                .upload(fileName, buffer, {
                    contentType: file.type,
                })
            console.log("Reach 1", error)
            if (error) {
                return NextResponse.json({ error: error.message }, { status: 500 })
            }

            const { data } = supabase.storage
                .from('pg-colive')
                .getPublicUrl(fileName)

            urls.push(data.publicUrl);
            const metaInfo = parsedMeta[i] || {}
            pgAttachList.push({
                url: data.publicUrl,
                caption: metaInfo.caption,
                isPrimary: metaInfo.isPrimary === 'true',
                order: parseInt(metaInfo.order),
                type: 'IMAGE',
                pgId: parseInt(pgId),
                pgRoomId: pgRoomId ? parseInt(pgRoomId) : null,
            })
        }

        console.log(pgAttachList)

        return NextResponse.json({ urls })
    } catch (err) {
        console.error('API upload error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
