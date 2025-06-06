"use client";
import {Button} from "@/components/ui/button";
import {Share2} from "lucide-react";
import React from "react";

export default function ShareButton() {

    const copyToClipboard = (text) => {
        const el = document.createElement("textarea");
        el.value = text;
        el.setAttribute("readonly", "readonly");
        el.style.position = "absolute";
        el.style.left = "-9999px";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);

    };



    return (
    <Button className="bg-purple-500 text-white hover:bg-purple-600 flex gap-1 items-center " onClick={() => copyToClipboard(window.location.href)}>
        <Share2/> Share
    </Button>
)
}