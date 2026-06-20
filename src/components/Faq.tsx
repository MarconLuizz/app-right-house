import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";


interface FaqProps {
  question: string;
  answer: string;
}

export function Faq({ question, answer }: FaqProps){

const [expand, setExpand] = useState(false);
const expandClass = expand ? 'display' : 'hidden';
const ansClass = `${expandClass}`


    return(
        <>
        <div className="shadow border w-[46%] rounded-sm bg-card border-t-0 mx-auto mb-2.5">
              <div className="p-4 relative ">
                <div className="font-heading font-semibold text-[18px]">
                    {question}
                </div>
                <button className="text-xl absolute top-0 right-0 p-4 focus:outline-none" onClick={() => setExpand(!expand) }>
                    {expand ? <ChevronUp className="w-5"/> : <ChevronDown className="w-5"/>}
                </button>
                <div className={`${ansClass} mt-3 text-md text-gray-600`}>
                    {answer}
                </div>
              </div>
        </div>
        </>
    );
}