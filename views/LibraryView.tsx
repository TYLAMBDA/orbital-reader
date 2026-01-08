import React from 'react';
import { motion } from 'framer-motion';
import { Book as BookIcon, Star, Clock, MoreVertical } from 'lucide-react';
import { Book, DockPosition, Language } from '../types';

interface LibraryViewProps {
    onSelectBook: (book: Book) => void;
    dockPosition: DockPosition;
    language: Language;
}

const mockBooks: Book[] = [
    { id: '1', title: "The Three-Body Problem", author: "Cixin Liu", coverColor: "bg-blue-600", progress: 65 },
    { id: '2', title: "Dune", author: "Frank Herbert", coverColor: "bg-orange-600", progress: 20 },
    { id: '3', title: "Neuromancer", author: "William Gibson", coverColor: "bg-purple-600", progress: 0 },
    { id: '4', title: "Snow Crash", author: "Neal Stephenson", coverColor: "bg-slate-600", progress: 90 },
    { id: '5', title: "Foundation", author: "Isaac Asimov", coverColor: "bg-indigo-600", progress: 45 },
    { id: '6', title: "Hyperion", author: "Dan Simmons", coverColor: "bg-emerald-600", progress: 10 },
];

const LibraryView: React.FC<LibraryViewProps> = ({ onSelectBook, dockPosition, language }) => {
    
    const t = {
        en: { title: "My Library", subtitle: "12 Books • 3 In Progress" },
        zh: { title: "我的书库", subtitle: "12 本书 • 3 本阅读中" }
    }[language];

    // Responsive Padding: p-6 on mobile, p-12/16 on desktop
    const containerPadding = "p-6 md:p-12 lg:p-16";

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`w-full h-full overflow-y-auto ${containerPadding} max-w-7xl mx-auto`}
        >
            <div className="flex justify-between items-end mb-8 border-b border-slate-800 pb-4">
                <div>
                    <h2 className="text-2xl md:text-4xl font-bold text-slate-100">{t.title}</h2>
                    <p className="text-sm md:text-base text-slate-400 mt-2">{t.subtitle}</p>
                </div>
                <div className="flex space-x-4 text-slate-400">
                    <button className="hover:text-white transition"><Clock size={20} /></button>
                    <button className="hover:text-white transition"><Star size={20} /></button>
                </div>
            </div>

            {/* Responsive Grid: 1 col mobile, 2 col md, 3 col lg */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 pb-20">
                {mockBooks.map((book, i) => (
                    <motion.div
                        key={book.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * i + 0.3 }}
                        onClick={() => onSelectBook(book)}
                        className="group relative aspect-[2/3] rounded-lg overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                    >
                        {/* Mock Cover */}
                        <div className={`absolute inset-0 ${book.coverColor} opacity-80 group-hover:opacity-100 transition-opacity`}></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                        
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="text-lg font-bold leading-tight text-white mb-1">{book.title}</h3>
                            <p className="text-sm text-slate-300">{book.author}</p>
                            
                            {/* Progress Bar */}
                            <div className="mt-3 w-full bg-white/20 h-1 rounded-full overflow-hidden">
                                <div 
                                    className="bg-blue-400 h-full rounded-full" 
                                    style={{ width: `${book.progress}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-slate-400 mt-1 text-right">{book.progress}%</p>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 bg-black/40 rounded-full hover:bg-black/60 text-white">
                                <MoreVertical size={16} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default LibraryView;
