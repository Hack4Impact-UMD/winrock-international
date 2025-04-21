import React, { useState } from "react";
import axios from "axios";

const GeminiButton = () => {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState("");

    const handleClick = async () => {
        setLoading(true);
        try {
            const res = await axios.post("http://localhost:3001/api/gemini", {
                prompt: "Tell me a fun fact about space",
            });
            setResponse(res.data.text);
        } catch (err) {
            console.error("Error fetching Gemini response:", err);
            setResponse("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={handleClick} disabled={loading}>
                {loading ? "Thinking..." : "Ask Gemini"}
            </button>
            <p>{response}</p>
        </div>
    );
};

export default GeminiButton;
