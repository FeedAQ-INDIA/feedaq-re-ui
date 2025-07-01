"use client";
import React, {useEffect, useState} from "react";

export default function TransformationText({transformations}) {
    const [displayText, setDisplayText] = useState('');
    const [index, setIndex] = useState(0);
    const [isErasing, setIsErasing] = useState(false);
    const [charIndex, setCharIndex] = useState(0);

    const typingSpeed = 50;
    const erasingSpeed = 30;
    const pauseTime = 1000;

    useEffect(() => {
        const current = transformations[index];
        let timeout;

        if (!isErasing && charIndex < current.length) {
            timeout = setTimeout(() => {
                setDisplayText(current.slice(0, charIndex + 1));
                setCharIndex((prev) => prev + 1);
            }, typingSpeed);
        } else if (isErasing && charIndex > 0) {
            timeout = setTimeout(() => {
                setDisplayText(current.slice(0, charIndex - 1));
                setCharIndex((prev) => prev - 1);
            }, erasingSpeed);
        } else {
            timeout = setTimeout(() => {
                if (!isErasing) {
                    setIsErasing(true);
                } else {
                    setIsErasing(false);
                    setIndex((prev) => (prev + 1) % transformations.length);
                }
            }, pauseTime);
        }

        return () => clearTimeout(timeout);
    }, [charIndex, isErasing, index]);

    return (
        <div className="text-center">
            <p className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
                 <span className=" font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
                    {displayText}
                    <span className="animate-ping text-white">|</span>
                </span>
            </p>

        </div>
    );
};
