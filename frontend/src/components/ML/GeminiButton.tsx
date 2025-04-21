import React, { useState } from "react";
import axios from "axios";

const GeminiVision = () => {
    const [file, setFile] = useState<File | null>(null);
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await axios.post("http://localhost:3001/api/vision", formData);
            setResponse(res.data.text);
        } catch (err) {
            console.error("Upload error:", err);
            setResponse("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Upload an image for Gemini to read</h2>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <button onClick={handleUpload} disabled={!file || loading}>
                {loading ? "Analyzing..." : "Analyze Image"}
            </button>
            <pre style={{ whiteSpace: "pre-wrap" }}>{response}</pre>
        </div>
    );
};

export default GeminiVision;
