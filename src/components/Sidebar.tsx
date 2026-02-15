import React, { useState } from 'react';
import {
    FileText,
    Plus,
    Trash2,
    Copy,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    Pencil
} from 'lucide-react';
import { ResumeData } from '@/types';

interface SidebarProps {
    resumes: ResumeData[];
    currentId: string;
    isOpen: boolean;
    onToggle: () => void;
    onSelect: (id: string) => void;
    onCreate: (name: string) => void;
    onDelete: (id: string) => void;
    onDuplicate: (id: string) => void;
    onRename: (id: string, newName: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    resumes,
    currentId,
    isOpen,
    onToggle,
    onSelect,
    onCreate,
    onDelete,
    onDuplicate,
    onRename
}) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');

    const handleCreate = () => {
        if (newName.trim()) {
            onCreate(newName.trim());
            setNewName('');
            setIsAdding(false);
        }
    };

    const handleRename = (id: string) => {
        if (editingName.trim()) {
            onRename(id, editingName.trim());
            setEditingId(null);
        }
    };

    return (
        <div className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-50 shadow-xl ${isOpen ? 'w-64' : 'w-12'} no-print`}>
            {/* Toggle Button */}
            <button
                onClick={() => onToggle()}
                className="absolute -right-3 top-10 bg-white border border-gray-200 rounded-full p-1 hover:bg-gray-50 text-gray-500 shadow-sm"
            >
                {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>

            <div className={`flex flex-col h-full overflow-hidden ${!isOpen && 'invisible'}`}>
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="font-bold text-gray-800 flex items-center gap-2">
                        <FileText size={20} className="text-blue-600" />
                        My Resumes
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                    {resumes.map((resume) => (
                        <div
                            key={resume.id}
                            onClick={() => onSelect(resume.id!)}
                            className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors mb-1 ${currentId === resume.id
                                ? 'bg-blue-50 text-blue-700 border border-blue-100'
                                : 'hover:bg-gray-50 text-gray-600 border border-transparent'
                                }`}
                        >
                            <div className="flex items-center gap-2 overflow-hidden flex-1">
                                <FileText size={16} className={currentId === resume.id ? 'text-blue-500' : 'text-gray-400'} />
                                {editingId === resume.id ? (
                                    <input
                                        autoFocus
                                        className="text-sm font-medium bg-white border border-blue-300 outline-none rounded px-1 w-full"
                                        value={editingName}
                                        onChange={(e) => setEditingName(e.target.value)}
                                        onBlur={() => handleRename(resume.id!)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleRename(resume.id!)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                ) : (
                                    <span className="text-sm font-medium truncate">{resume.resumeTitle || resume.name}</span>
                                )}
                            </div>

                            <div className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingId(resume.id!);
                                        setEditingName(resume.resumeTitle || resume.name);
                                    }}

                                    className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600"
                                    title="Rename"
                                >
                                    <Pencil size={12} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDuplicate(resume.id!); }}
                                    className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600"
                                    title="Duplicate"
                                >
                                    <Copy size={12} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDelete(resume.id!); }}
                                    className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-red-500"
                                    title="Delete"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        </div>
                    ))}


                    {isAdding ? (
                        <div className="p-2 border border-blue-200 rounded-lg bg-blue-50 mt-2">
                            <input
                                autoFocus
                                type="text"
                                placeholder="Resume Name..."
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                                className="w-full text-sm p-2 outline-none rounded border border-gray-200 mb-2"
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleCreate}
                                    className="flex-1 bg-blue-600 text-white text-xs py-1.5 rounded hover:bg-blue-700"
                                >
                                    Add
                                </button>
                                <button
                                    onClick={() => setIsAdding(false)}
                                    className="flex-1 bg-gray-200 text-gray-700 text-xs py-1.5 rounded hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAdding(true)}
                            className="w-full flex items-center gap-2 p-3 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mt-2 border border-dashed border-blue-200"
                        >
                            <Plus size={16} />
                            New Resume
                        </button>
                    )}
                </div>

                <div className="p-4 border-t border-gray-100 text-[10px] text-gray-400">
                    Last updated: {new Date().toLocaleDateString()}
                </div>
            </div>
        </div>
    );
};
