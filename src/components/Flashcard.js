import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid/dist'

function FlashCard({ flashcard }) {
    const [flip, setFlip] = useState(false);
    const [height, setHeight] = useState(0);
    const frontRef = useRef();
    const backRef = useRef();
    const [correct, setCorrect] = useState(false);
    const [cardColor, setCardColor] = useState("white");
    function getCardHeight() {
        const frontHeight = frontRef.current.getBoundingClientRect().height;
        const backHeight = backRef.current.getBoundingClientRect().height;
        return Math.max(frontHeight, backHeight, 100);
    }
    useEffect(() => {
        setHeight(getCardHeight());
    }, [flashcard.question, flashcard.options, flashcard.answer]);
    useEffect(() => {
        window.addEventListener("resize", setHeight(getCardHeight()));
        return () => {
            window.removeEventListener("resize", setHeight(getCardHeight()));
        }
    }, [])
    useEffect(() => {
        if (!flip) {
            return setCardColor("white");
        }
        setCardColor(correct ? "lightgreen" : "salmon");
    }, [correct, flip]);
    return (
        <div 
            style={{ height: height, backgroundColor: cardColor }}
            className={`card ${flip ? "flip" : ""}`}
            onClick={() => {
                if (!flip) { return; }
                setFlip(flip => !flip);
                setCorrect(false);
            }}
        >
            <div className="front" ref={frontRef}>
                {flashcard.question}
                <div className="flashcard-options">
                    {flashcard.options.map(option => (
                        <div 
                            key={uuidv4()} 
                            className="flashcard-option"
                            onClick={() => {
                                console.log("answer: ", flashcard.answer, "select: ", option);
                                if (flashcard.answer === option) {
                                    setCorrect(true);
                                }
                                setFlip(flip => !flip);
                            }}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            </div>
            <div className="back" ref={backRef}>{flashcard.answer}</div>
        </div>
    );
}

export default FlashCard;