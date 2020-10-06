import React, { useState, useEffect, useRef } from 'react';
import FlashcardList from './components/FlashcardList';
import { v4 as uuidv4 } from 'uuid';

const DIFICULTY = [{ value: "easy", name: "Easy"}, {value: "medium", name: "Medium"}, {value: "hard", name: "Hard"}];
const TYPE = [{ value: "multiple", name: "Multiple Choice"}, { value: "boolean", name: "True / False"}];
const CATEGORY = [{"id":9,"name":"General Knowledge"},{"id":10,"name":"Entertainment: Books"},{"id":11,"name":"Entertainment: Film"},{"id":12,"name":"Entertainment: Music"},{"id":13,"name":"Entertainment: Musicals & Theatres"},{"id":14,"name":"Entertainment: Television"},{"id":15,"name":"Entertainment: Video Games"},{"id":16,"name":"Entertainment: Board Games"},{"id":17,"name":"Science & Nature"},{"id":18,"name":"Science: Computers"},{"id":19,"name":"Science: Mathematics"},{"id":20,"name":"Mythology"},{"id":21,"name":"Sports"},{"id":22,"name":"Geography"},{"id":23,"name":"History"},{"id":24,"name":"Politics"},{"id":25,"name":"Art"},{"id":26,"name":"Celebrities"},{"id":27,"name":"Animals"},{"id":28,"name":"Vehicles"},{"id":29,"name":"Entertainment: Comics"},{"id":30,"name":"Science: Gadgets"},{"id":31,"name":"Entertainment: Japanese Anime & Manga"},{"id":32,"name":"Entertainment: Cartoon & Animations"}];

function App() {
    const [flashcards, setFlashcards] = useState([]);
    const [numberOfQuestion, setNumberOfQuestion] = useState(10);
    const [dificulty, setDifficulty] = useState(DIFICULTY[0].value);
    const [type, setType] = useState(TYPE[0].value);
    const [category, setCategory] = useState(CATEGORY[0].id);
    const [submit, setSubmit] = useState(false);
    const [toggleGenerator, setToggleGenerator] = useState(false);
    const generatorContainerRef = useRef();
    useEffect(() => {
        if (!submit) {
            return;
        }
        fetch(`https://opentdb.com/api.php?amount=${numberOfQuestion}&category=${category}&type=${type}`)
        .then(res => res.json())
        .then(data => {
            setFlashcards(
                data.results.map(data => {
                    const answer = decodeString(data.correct_answer);
                    const options = [...data.incorrect_answers.map(opt => decodeString(opt)), answer];
                    return {
                        id: uuidv4(),
                        question: decodeString(data.question),
                        answer: answer,
                        options: options.sort(() => Math.random() - 0.5),
                    }
                })
            );
            setSubmit(false);
        })
        .catch(e => console.error(e));
    }, [submit, category, numberOfQuestion, type]);
    useEffect(() => {
        if (!toggleGenerator) {      
            generatorContainerRef.current.style.opacity = 0;       
            setTimeout(() => generatorContainerRef.current.style.display = "none");
            
        } else {
            generatorContainerRef.current.style.display = "block";
            setTimeout(() => generatorContainerRef.current.style.opacity = 1);
        }
    }, [toggleGenerator]);
    function handleSubmit(e) {
        e.preventDefault();
        setSubmit(true);
        setToggleGenerator(false);
    }
    return (
        <>  
            <button className="toggle-generator-button" onClick={() => setToggleGenerator(toggle => !toggle)}>{toggleGenerator ? "Close" : "Options"}</button>
            <div 
                ref={generatorContainerRef} 
                className="question-generator-form-container"
            >
                <form 
                    className="question-generator-form"
                    onSubmit={handleSubmit}    
                >
                    <label>Number of Questions: </label>
                    <input type="number" value={numberOfQuestion} onChange={(e) => setNumberOfQuestion(e.target.value)} min={1} max={50} />
                    <label>Select Category: </label> 
                    <select value={category} onChange={e => setCategory(e.target.value)} >
                        {CATEGORY.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                    <label>Select Difficulty: </label>
                    <select value={dificulty} onChange={e => setDifficulty(e.target.value)}>
                        {DIFICULTY.map(difficulty => (
                            <option key={uuidv4()} value={difficulty.value}>{difficulty.name}</option>
                        ))}
                    </select>
                    <label>Select Type: </label>
                    <select value={type} onChange={e => setType(e.target.value)}>
                        {TYPE.map(type => (
                            <option key={uuidv4()} value={type.value}>{type.name}</option>
                        ))}
                    </select>
                    <input type="submit" />
                </form>
            </div>
            <FlashcardList flashcards={flashcards} />
        </>
    );
}

function decodeString(str) {
    const txtArea = document.createElement("textarea");
    txtArea.innerHTML = str;
    return txtArea.value;
}

export default App;