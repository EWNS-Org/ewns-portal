import { TextField } from "@mui/material";
import RichEditor from "../common/BundledRichEditor/RichEditor";
import { useRef } from "react";

const AboutUsTab = ({ profile, setProfile }: any) => {

    const editorRef = useRef(null);

    return (
        <div className="container  w-full" style={{ fontFamily: "source Sans pro" }}>
            <div className=" bg-white p-6 h-[800px] shadow-md w-full" style={{ borderBottomLeftRadius: "15px", borderBottomRightRadius: "15px" }}>
                <div className="h-full w-full">
                    <h2 className="text-xl font-semibold mb-4">Short Description</h2>

                    <div className="mb-[2%]">
                        <TextField
                            required
                            id="outlined-required"
                            label="Short Description"
                            multiline
                            rows={4}
                            sx={{ marginBottom: "2%", width: "100%" }}
                            onChange={(e: any) => setProfile({ ...profile, shortBio: e.target.value })}
                            value={profile.shortBio}
                        />
                    </div>
                    <div className="w-full">
                        <h2 className="text-xl font-semibold mb-4">Description</h2>

                        <div className='editordiv w-full'>
                            <RichEditor
                                onInit={(_evt: any, editor: any) => editorRef.current = editor}
                                initialValue={profile.description}
                                init={{
                                    height: 400,
                                    width: "100%",
                                    menubar: false,
                                    plugins: [
                                        'advlist', 'anchor', 'autolink', 'link', 'lists',
                                        'searchreplace', 'table', 'wordcount', 'code', 'directionality', 'media', 'preview', 'image', 'emoticons'
                                    ],
                                    toolbar: 'undo redo | blocks | ' +
                                        'bold italic underline forecolor | alignleft aligncenter ' +
                                        'alignright alignjustify | bullist numlist outdent indent | ' +
                                        'code directionality media table preview image emoticons',
                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',

                                }}

                                onChange={() => setProfile({ ...profile, description: (editorRef.current as any).getContent() })
                                }
                            />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUsTab;