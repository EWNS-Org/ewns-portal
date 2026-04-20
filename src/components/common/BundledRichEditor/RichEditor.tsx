'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const defaultModules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        [{ direction: 'rtl' }],
        ['clean'],
    ],
};

interface RichEditorProps {
    value?: string;
    onChange?: (content: string) => void;
    readOnly?: boolean;
    height?: number | string;
    placeholder?: string;
    modules?: any;
}

export default function RichEditor({
    value = '',
    onChange,
    readOnly = false,
    height = 340,
    placeholder,
    modules,
}: RichEditorProps) {
    const editorModules = useMemo(() => {
        if (readOnly) return { toolbar: false };
        return modules || defaultModules;
    }, [readOnly, modules]);

    return (
        <div style={{ height }}>
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                readOnly={readOnly}
                modules={editorModules}
                placeholder={placeholder}
                style={{ height: typeof height === 'number' ? height - 42 : height }}
            />
        </div>
    );
}