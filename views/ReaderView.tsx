import React from 'react';
import { motion } from 'framer-motion';
import { Share2, Type, Bookmark } from 'lucide-react';
import { DockPosition, Language, Book } from '../types';

interface ReaderViewProps {
    dockPosition: DockPosition;
    language: Language;
    book: Book | null;
}

// Mock Content Database using real excerpts for immersion
const bookExcerpts: Record<string, string[]> = {
    '1': [ // The Three-Body Problem
        "The nanosuit was soft to the touch, but Wang Miao felt like he was wearing a layer of flayed skin. It monitored his heart rate, his sweat, his trembling.",
        "He stood in front of the window. The city was a sea of lights, but to him, it was a burning circuit board, calculating the countdown to humanity's end.",
        "Physics has never existed, and will never exist. The suicide note of Yang Dong replayed in his mind.",
        "The frontiers of science were not merely expanding; they were shattering. And he was standing on the precipice, looking down into the abyss where the laws of nature dissolved into chaos."
    ],
    '2': [ // Dune
        "A beginning is the time for taking the most delicate care that the balances are correct. This is known by every sister of the Bene Gesserit.",
        "To begin your study of the life of Muad'Dib, then, take care that you first place him in his time: born in the 57th year of the Padishah Emperor Shaddam IV.",
        "And take the most special care that you locate him in his place: the planet Arrakis. Do not be deceived by the fact that he was born on Caladan and lived his first years there. Arrakis, the planet known as Dune, is forever his place.",
        "The mystery of life isn't a problem to solve, but a reality to experience."
    ],
    'default': [
        "This is a placeholder text for books that do not have specific mock content in this prototype.",
        "The Orbital Reader interface allows for a focused reading experience free from distractions.",
        "The text you are reading flows naturally, adapting to the screen size and your reading speed.",
        "Imagine complex worlds and vivid characters coming to life as you scroll through these pages."
    ]
};

const ReaderView: React.FC<ReaderViewProps> = ({ dockPosition, language, book }) => {
    if (!book) return null;

    const t = {
        en: { chapter: "Chapter 1", back: "Back" },
        zh: { chapter: "第一章", back: "返回" }
    }[language];

    // Responsive Padding
    const containerPadding = "p-6 md:p-12 lg:p-16";
    
    // Get excerpts or default
    const paragraphs = bookExcerpts[book.id] || bookExcerpts['default'];

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`w-full h-full overflow-y-auto ${containerPadding} max-w-4xl mx-auto pb-32`}
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12 border-b border-slate-800 pb-6">
                <div>
                    <div className="text-blue-400 text-sm font-bold tracking-widest uppercase mb-2">{t.chapter}</div>
                    <h1 className="text-3xl md:text-5xl font-serif text-slate-100 leading-tight mb-2">{book.title}</h1>
                    <p className="text-slate-400 italic">{book.author}</p>
                </div>
                <div className="flex space-x-4 mt-4 md:mt-0 text-slate-400">
                    <button className="hover:text-blue-400 transition"><Type size={20} /></button>
                    <button className="hover:text-blue-400 transition"><Bookmark size={20} /></button>
                    <button className="hover:text-blue-400 transition"><Share2 size={20} /></button>
                </div>
            </div>

            {/* Content */}
            <div className="space-y-6 md:space-y-8">
                {paragraphs.map((text, i) => (
                    <motion.p 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + (i * 0.1) }}
                        className="text-lg md:text-xl leading-relaxed text-slate-300 font-serif"
                    >
                        {text}
                    </motion.p>
                ))}
            </div>

            {/* Footer / Pagination Placeholder */}
            <div className="mt-16 flex justify-center text-slate-500 text-sm">
                <span>1 / 24</span>
            </div>
        </motion.div>
    );
};

export default ReaderView;