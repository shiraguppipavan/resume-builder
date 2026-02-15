import { useState, useEffect } from 'react';
import { ResumeData } from '@/types';
import BLANK_RESUME from '../data/templates.json';


const STORAGE_KEY = 'resume_builder_data';

interface StorageState {
    resumes: ResumeData[];
    currentId: string;
}

export const useResumes = () => {
    const [state, setState] = useState<StorageState>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Migration: Ensure resumeTitle exists for existing resumes
                parsed.resumes = parsed.resumes.map((r: ResumeData) => ({
                    ...BLANK_RESUME, // Use blank template as base for missing fields
                    ...r,
                    resumeTitle: r.resumeTitle || r.name || "Untitled Resume"
                }));
                return parsed;
            } catch (e) {
                console.error('Failed to parse resumes from localStorage', e);
            }
        }

        // Initial state if nothing in localStorage - start with blank template
        const defaultResume = {
            ...BLANK_RESUME,
            id: 'default',
            resumeTitle: "New Resume"
        };
        return {
            resumes: [defaultResume],
            currentId: 'default',
        };
    });


    // Load from FS on mount
    useEffect(() => {
        const loadFromFS = async () => {
            try {
                const response = await fetch('/api/resumes');
                if (response.ok) {
                    const fsResumes = await response.json();

                    if (fsResumes.length > 0) {
                        setState(prev => {
                            // Merge FS resumes with local ones, FS takes precedence for same ID
                            const merged = [...prev.resumes];
                            fsResumes.forEach((fsR: ResumeData) => {
                                const idx = merged.findIndex(r => r.id === fsR.id);
                                if (idx > -1) {
                                    merged[idx] = fsR;
                                } else {
                                    merged.push(fsR);
                                }
                            });
                            return { ...prev, resumes: merged };
                        });
                    } else if (state.resumes.length > 0) {
                        // If FS is empty but we have local data, sync local to FS
                        console.log('[FS API] Syncing local data to FS');
                        state.resumes.forEach(r => saveToFS(r));
                    }
                }
            } catch (e) {
                console.error('Failed to load from FS', e);
            }
        };
        loadFromFS();
    }, []);


    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    const saveToFS = async (resume: ResumeData) => {
        try {
            await fetch('/api/resumes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(resume)
            });
        } catch (e) {
            console.error('Failed to save to FS', e);
        }
    };

    const deleteFromFS = async (resumeTitle: string) => {
        try {
            const safeFilename = resumeTitle.replace(/[^a-zA-Z0-9-_ ]/g, '').replace(/\s+/g, '_');
            await fetch(`/api/resumes/${safeFilename}`, { method: 'DELETE' });
        } catch (e) {
            console.error('Failed to delete from FS', e);
        }
    };


    const currentResume = state.resumes.find(r => r.id === state.currentId) || state.resumes[0];

    const updateCurrentResume = (newData: Partial<ResumeData>) => {
        setState(prev => {
            const updatedResumes = prev.resumes.map(r =>
                r.id === prev.currentId
                    ? { ...r, ...newData, updatedAt: new Date().toISOString() }
                    : r
            );
            const current = updatedResumes.find(r => r.id === prev.currentId);
            if (current) saveToFS(current);
            return {
                ...prev,
                resumes: updatedResumes
            };
        });
    };

    const createResume = (name: string, template: ResumeData = BLANK_RESUME) => {
        const newId = crypto.randomUUID();
        const newResume: ResumeData = {
            ...template,
            id: newId,
            resumeTitle: name,
            updatedAt: new Date().toISOString()
        };

        saveToFS(newResume);
        setState(prev => ({
            resumes: [...prev.resumes, newResume],
            currentId: newId
        }));
        return newId;
    };

    const deleteResume = (id: string) => {
        // Find the resume to get its title for FS deletion
        const resumeToDelete = state.resumes.find(r => r.id === id);
        if (resumeToDelete?.resumeTitle) {
            deleteFromFS(resumeToDelete.resumeTitle);
        }

        setState(prev => {
            // Don't delete the last resume
            if (prev.resumes.length <= 1) return prev;

            const remaining = prev.resumes.filter(r => r.id !== id);

            // If we're deleting the current resume, switch to the first remaining one
            const newCurrentId = prev.currentId === id
                ? (remaining[0]?.id || prev.currentId)
                : prev.currentId;

            return {
                resumes: remaining,
                currentId: newCurrentId
            };
        });
    };



    const selectResume = (id: string) => {
        setState(prev => ({ ...prev, currentId: id }));
    };

    const renameResume = (id: string, newName: string) => {
        // Find the resume to get its old title for FS deletion
        const resumeToRename = state.resumes.find(r => r.id === id);
        const oldTitle = resumeToRename?.resumeTitle;

        // Delete the old file if title is changing
        if (oldTitle && oldTitle !== newName) {
            deleteFromFS(oldTitle);
        }

        setState(prev => {
            const updatedResumes = prev.resumes.map(r =>
                r.id === id ? { ...r, resumeTitle: newName, updatedAt: new Date().toISOString() } : r
            );
            const updated = updatedResumes.find(r => r.id === id);
            if (updated) saveToFS(updated);
            return {
                ...prev,
                resumes: updatedResumes
            };
        });
    };


    const duplicateResume = (id: string) => {
        const toDuplicate = state.resumes.find(r => r.id === id);
        if (!toDuplicate) return;

        const newId = crypto.randomUUID();
        const newResume = {
            ...toDuplicate,
            id: newId,
            resumeTitle: `${toDuplicate.resumeTitle || toDuplicate.name} (Copy)`,
            updatedAt: new Date().toISOString()
        };

        saveToFS(newResume);
        setState(prev => ({
            resumes: [...prev.resumes, newResume],
            currentId: newId
        }));
    };


    return {
        resumes: state.resumes,
        currentResume,
        updateCurrentResume,
        createResume,
        deleteResume,
        selectResume,
        renameResume,
        duplicateResume
    };
};
