// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/util/supabase/client'

export async function POST(req) {
    try {
        const formData = await req.formData()
        const file = formData.get('file');
        const type = formData.get('type');


        if (!file || !(file instanceof Blob)) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
        }

        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const ext = file.name?.split('.').pop() || 'jpg'
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

        const { error } = await supabase.storage
            .from(type)
            .upload(fileName, buffer, {
                contentType: file.type,
            })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        const { data } = supabase.storage
            .from(type)
            .getPublicUrl(fileName)

        const uploadedFile = {
            url: data.publicUrl,
            fileType: 'IMAGE',
            type: type
        }

        return NextResponse.json({ file: uploadedFile })
    } catch (err) {
        console.error('API upload error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
