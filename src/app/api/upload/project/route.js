// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from "@/util/supabase/client";

export async function POST(req) {
    try {
        const formData = await req.formData();
        const files = formData.getAll('files');
        const projectId = formData.get('projectId');

        // Extract meta from formData
        const metaEntries = Array.from(formData.entries()).filter(([key]) =>
            key.startsWith('meta[')
        );

        const parsedMeta = metaEntries.reduce((acc, [key, value]) => {
            const match = key.match(/meta\[(\d+)\]\[(.+)\]/);
            if (match) {
                const [, index, field] = match;
                acc[index] = acc[index] || {};
                acc[index][field] = value;
            }
            return acc;
        }, {} );

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
        }

        const urls = [];
        const projectAttachmentList = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const ext = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

            const { error } = await supabase.storage
                .from('project')
                .upload(fileName, buffer, {
                    contentType: file.type,
                });

            if (error) {
                console.error('Supabase upload error:', error);
                return NextResponse.json({ error: error.message }, { status: 500 });
            }

            const { data } = supabase.storage
                .from('project')
                .getPublicUrl(fileName);

            urls.push(data.publicUrl);

            const metaInfo = parsedMeta[i] || {};

            projectAttachmentList.push({
                url: data.publicUrl,
                caption: metaInfo.caption || '',
                isPrimary: metaInfo.isPrimary === 'true',
                order: parseInt(metaInfo.order) || i + 1,
                type: 'IMAGE',
                projectId: projectId,
            });
        }

        return NextResponse.json({ projectAttachmentList });
    } catch (err) {
        console.error('API upload error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
