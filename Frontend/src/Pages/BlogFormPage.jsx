import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { userContext } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import BlogEditor from "../Components/BlogEditor";
import toast from 'react-hot-toast';

function BlogFormPage(){

    const [isSubmitting,setIsSubmitting] = useState(false);
    const [titleLength,setTitleLength] = useState(0);
    const formRef = useRef(null);
    const editorRef = useRef(null);
    const {user} = useContext(userContext);
    const fileInputRef = useRef(null);
    const [previewUrl,setPreviewUrl] = useState(null);
    const go = useNavigate();
    
    const blogContent = sessionStorage.getItem("blogContent");

    useEffect(()=>{
        let blogDraft;
        try {
            blogDraft = JSON.parse(sessionStorage.getItem("blogDraft"));
        } catch {
            sessionStorage.removeItem("blogDraft");
        }
        
        if(!blogDraft || !formRef.current) return ;

        Object.entries(blogDraft).forEach(([name,value]) => {
            const field = formRef.current.elements[name];

            if(field && field.type !== "file"){
                field.value = value;
            }
        })
        setTitleLength(formRef.current.elements.title?.value.length ?? 0);

        sessionStorage.removeItem("blogDraft");
        sessionStorage.removeItem("blogContent");

    },[])

    useEffect(() => {
        return () => {
            if(previewUrl) URL.revokeObjectURL(previewUrl);
        };
    },[previewUrl]);

    const resetFormHandler = () => {
        formRef.current.reset();
        fileInputRef.current.value = "";
        editorRef.current?.setContent("");
        setPreviewUrl(null);
        setTitleLength(0);
    }

    const handleBlogPost = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);
        const content = editorRef.current?.getContent() ?? "";
        const plainContent = editorRef.current?.getContent({ format: "text" }).trim() ?? "";

        if(!plainContent){
            toast.error("Please add some content to your story before publishing.");
            return;
        }

        const wordCount = plainContent.split(/\s+/u).filter(Boolean).length;
        if(wordCount < 50){
            toast.error(`Your blog needs at least 50 words. You have ${wordCount}.`);
            return;
        }

        data.set("content",content);
        setIsSubmitting(true);
        const draft = Object.fromEntries(data);

        if(!user){
            sessionStorage.setItem("blogDraft",JSON.stringify(draft));
            sessionStorage.setItem("blogContent",content);
            setIsSubmitting(false);
            go("/user/login");
            return ;
        }

        try{
            const response = await axios.post("/api/blogs/create",data);
            const blogId = response.data.blogId;
            const msg = response.data.msg;

            if(msg) {
                toast.error(`Backend Error : ${msg}`)
                return ;
            }

            if(blogId){
                toast.success(<> Blog posted successfully !! <br/> BlogId : {blogId} </>)
            }

            form.reset();
            setPreviewUrl(null);
            sessionStorage.removeItem("blogDraft");
            sessionStorage.removeItem("blogContent");
            go("/user");
        }catch(err){
            toast.error(err.response?.data?.msg || err.message || "Unable to post the Blog.");
        }finally{
            setIsSubmitting(false);
        }
    };

    const handleCategoryChange = (value) => {
        const category = formRef.current.elements.category;
        category.value = value;
    }

    const handleTitleChange = (value) => {
        const title = formRef.current.elements.title;
        title.value = value;
        setTitleLength(value.length);
    }

    const handleThumbnailUpload = (e) => {
        const file = e.target.files[0];
        if(!file) return;

        if(!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 5*1024*1024) {
            toast.error("Choose a PNG, JPG, or WEBP image smaller than 5 MB.");
            e.target.value = "";
            return;
        }

        toast.success("Thumbnail uploaded successfully");
        setPreviewUrl(URL.createObjectURL(file));
    }

    return (
    <>
        {/* FLOATING ORBS */}
    <div className="orb orb-1"></div>
    <div className="orb orb-2"></div>

    <Navbar/>

    {/* MAIN FORM CONTAINER */}
    <main className="editor-wrapper">

        <div className="page-header">
            <div className="header-tag">
                <span className="dot"></span>
                Story Creator Studio
            </div>
            <h1>Publish a New Story</h1>
            <p>Share your perspective, research, and stories with curious minds across the world.</p>
        </div>

        <div className="form-card">

            <form id="blogPostForm" encType="multipart/form-data" onSubmit={handleBlogPost} ref={formRef}>

                <fieldset disabled = {isSubmitting}>

                {/*1. CATEGORY (SIMPLE INPUT WITH SUGGESTIONS, NO OPTIONS) */}
                <div className="form-group">
                    <div className="form-label-row">
                        <label htmlFor="category" className="form-label">
                            Category <span className="required-star">*</span>
                        </label>
                        <span className="label-hint">Type or click a suggestion</span>
                    </div>

                    <input
                        type="text"
                        id="category"
                        name="category"
                        className="text-input"
                        required
                        placeholder="e.g. Technology, Startups, Productivity, Design, AI..."
                        autoComplete="off"
                    />

                    {/* CATEGORY SUGGESTION PILLS */}
                    <div className="suggestion-box">
                        <span className="suggestion-title">Suggestions:</span>
                        <button type="button" className="suggestion-pill" onClick={()=>handleCategoryChange("Technology")}>💡 Technology</button>
                        <button type="button" className="suggestion-pill" onClick={()=>handleCategoryChange("Artificial Intelligence")}>🤖 AI</button>
                        <button type="button" className="suggestion-pill" onClick={()=>handleCategoryChange("Startups")}>🚀 Startups</button>
                        <button type="button" className="suggestion-pill" onClick={()=>handleCategoryChange("Programming")}>💻 Programming</button>
                        <button type="button" className="suggestion-pill" onClick={()=>handleCategoryChange("Productivity")}>📚 Productivity</button>
                        <button type="button" className="suggestion-pill" onClick={()=>handleCategoryChange("Design")}>🎨 Design</button>
                        <button type="button" className="suggestion-pill" onClick={()=>handleCategoryChange("Psychology")}>🧠 Psychology</button>
                        <button type="button" className="suggestion-pill" onClick={()=>handleCategoryChange("Finance")}>💰 Finance</button>
                        <button type="button" className="suggestion-pill" onClick={()=>handleCategoryChange("Lifestyle")}>🌱 Lifestyle</button>
                    </div>
                </div>


                {/* 2. TITLE */}
                <div className="form-group">
                    <div className="form-label-row">
                        <label htmlFor="title" className="form-label">
                            Story Title <span className="required-star">*</span>
                        </label>
                        <span className="label-hint" id="titleCharCount">{titleLength} / 120 chars</span>
                    </div>

                    <input
                        type="text"
                        id="title"
                        name="title"
                        className="text-input"
                        required
                        maxLength="120"
                        placeholder="e.g. The Art of Deep Focus in an Age of Infinite Distractions"
                        autoComplete="off"
                        onChange={(e) => setTitleLength(e.target.value.length)}
                        />

                    {/* TITLE STARTER SUGGESTIONS */}
                    <div className="suggestion-box">
                        <span className="suggestion-title">Starters:</span>
                        <button type="button" className="suggestion-pill title-starter" onClick={() => handleTitleChange("How I Built")} >"How I Built..."</button>
                        <button type="button" className="suggestion-pill title-starter" onClick={() => handleTitleChange("The Hidden Truth")}>"The Hidden Truth..."</button>
                        <button type="button" className="suggestion-pill title-starter" onClick={() => handleTitleChange("10 Lessons From")}>"10 Lessons From..."</button>
                        <button type="button" className="suggestion-pill title-starter" onClick={() => handleTitleChange("Why Most People")}>"Why Most People..."</button>
                    </div>
                </div>


                {/* 3. THUMBNAIL (FILE UPLOAD WITH LIVE PREVIEW) */}
                <div className="form-group">
                    <div className="form-label-row">
                        <label className="form-label">
                            Thumbnail Cover Image 
                        </label>
                        <span className="label-hint">Upload image (PNG, JPG, WEBP)</span>
                    </div>

                    <div className="thumbnail-layout">
                        <div>
                            {/* Hidden Native File Input */}
                            <input
                                type="file"
                                ref = {fileInputRef}
                                id="thumbnail"
                                name="thumbnail"
                                accept="image/png, image/jpeg, image/webp"
                                onChange={handleThumbnailUpload}
                                style={{ display: "none" }}
                            />

                            {/* Styled Clickable / Drag-and-Drop Upload Zone */}
                            {!previewUrl && <label className="file-upload-zone" id="fileUploadZone" htmlFor="thumbnail"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    if(e.dataTransfer.files[0]) {
                                        fileInputRef.current.files = e.dataTransfer.files;
                                        handleThumbnailUpload({ target: fileInputRef.current });
                                    }
                                }}
                            >
                                <div className="upload-icon">📁</div>
                                <p className="upload-text">
                                    <span>Click to upload</span> or drag and drop
                                </p>
                                <p className="upload-hint">PNG, JPG or WEBP (16:9 ratio recommended)</p>
                            </label>}

                            {/* Selected File Chip */}
                            {previewUrl && <div className="selected-file-chip active" id="selectedFileChip">
                                <div className="file-name-display">
                                    <span>🖼️</span>
                                    <span id="selectedFileName">{fileInputRef.current?.files[0]?.name}</span>
                                </div>
                                <button type="button" className="file-remove-btn" id="fileRemoveBtn" 
                                    onClick={()=>{
                                        fileInputRef.current.value = "";
                                        setPreviewUrl(null);
                                    }}
                                > ✕ Remove</button>
                            </div>}
                        </div>

                        {/* LIVE IMAGE PREVIEW BOX */}
                        <div className="thumbnail-preview-box" id="thumbnailPreviewBox">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Thumbnail preview" id="thumbnailImg" className="thumbnail-img"/>
                            ) : (
                                <div className="preview-placeholder" id="thumbnailPlaceholder">
                                    <span>🖼️</span>
                                    Image preview will appear here
                                </div>
                            )}
                        </div>
                    </div>
                </div>


                {/* 4. CONTENT (WITH FORMATTING TOOLBAR & PREVIEW) */}
                <div className="form-group">
                    <div className="form-label-row">
                        <label htmlFor="content" className="form-label">
                            Story Content <span className="required-star">*</span>
                        </label>
                    </div>

                    <BlogEditor onInit={(editor) => editorRef.current = editor} savedDraft={blogContent ? blogContent : null}/>

                </div>


                {/* SUBMISSION BUTTONS */}
                <div className="form-actions">
                    <button type="button" className="cancel-btn" id="resetBtn" onClick={resetFormHandler}>
                        Clear Fields
                    </button>

                    <button type="submit" className="submit-btn" id="submitBtn" disabled = {isSubmitting}>
                        <span>Publish Story</span>
                        <span>🚀</span>
                    </button>
                </div>

                </fieldset>
            </form>

        </div>

    </main>
    </>
    )
}

export default BlogFormPage;