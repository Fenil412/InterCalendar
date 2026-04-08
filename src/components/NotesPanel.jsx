import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * NotesPanel — Manages notes for the current month.
 *
 * Features:
 *  - Add notes (general or tied to selected range)
 *  - Inline edit & delete
 *  - Notes are grouped by month key
 *  - Animated list transitions
 */
export default function NotesPanel({
  monthKey,
  rangeStart,
  rangeEnd,
  notes,
  setNotes,
  monthLabel,
}) {
  const [newNote, setNewNote] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  /** Get notes for the current month */
  const monthNotes = useMemo(() => {
    return notes[monthKey]?.notes || [];
  }, [notes, monthKey]);

  /** Add a new note */
  const handleAdd = () => {
    const text = newNote.trim();
    if (!text) return;

    const note = {
      id: Date.now(),
      text,
      range: rangeStart && rangeEnd ? [rangeStart, rangeEnd] : null,
      createdAt: new Date().toISOString(),
    };

    setNotes((prev) => ({
      ...prev,
      [monthKey]: {
        notes: [...(prev[monthKey]?.notes || []), note],
      },
    }));

    setNewNote('');
  };

  /** Delete a note by ID */
  const handleDelete = (id) => {
    setNotes((prev) => ({
      ...prev,
      [monthKey]: {
        notes: (prev[monthKey]?.notes || []).filter((n) => n.id !== id),
      },
    }));
  };

  /** Begin editing a note */
  const startEdit = (note) => {
    setEditingId(note.id);
    setEditText(note.text);
  };

  /** Save the edited note */
  const saveEdit = (id) => {
    const text = editText.trim();
    if (!text) return;

    setNotes((prev) => ({
      ...prev,
      [monthKey]: {
        notes: (prev[monthKey]?.notes || []).map((n) =>
          n.id === id ? { ...n, text } : n
        ),
      },
    }));

    setEditingId(null);
    setEditText('');
  };

  /** Cancel editing */
  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  /** Format a date range for display */
  const formatRange = (range) => {
    if (!range) return null;
    const fmt = (str) => {
      const d = new Date(str + 'T00:00:00');
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };
    return `${fmt(range[0])} — ${fmt(range[1])}`;
  };

  /** Handle Enter key in input */
  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
    if (e.key === 'Escape' && editingId) {
      cancelEdit();
    }
  };

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-lg h-full flex flex-col"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
      }}
    >
      {/* ─── Panel Header ─── */}
      <div
        className="px-4 sm:px-5 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid var(--border-color)' }}
      >
        <div>
          <h3
            className="text-lg font-bold"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--text-primary)',
            }}
          >
            Notes
          </h3>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {monthLabel}
          </p>
        </div>

        {/* Note count badge */}
        {monthNotes.length > 0 && (
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: 'rgba(232, 122, 27, 0.1)',
              color: '#e87a1b',
            }}
          >
            {monthNotes.length}
          </span>
        )}
      </div>

      {/* ─── Add Note Input ─── */}
      <div className="px-4 sm:px-5 py-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
        <div className="flex gap-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, handleAdd)}
            placeholder={
              rangeStart && rangeEnd
                ? 'Add note for selected range...'
                : 'Add a note for this month...'
            }
            className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none transition-all placeholder:text-sm"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
            }}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            disabled={!newNote.trim()}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: newNote.trim()
                ? 'linear-gradient(135deg, #e87a1b, #d96011)'
                : 'var(--border-color)',
            }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </motion.button>
        </div>

        {/* Range attachment indicator */}
        {rangeStart && rangeEnd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-2 flex items-center gap-1.5"
          >
            <svg
              className="w-3 h-3"
              style={{ color: '#10b981' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            <span
              className="text-xs"
              style={{ color: '#10b981' }}
            >
              Will be linked to {formatRange([rangeStart, rangeEnd])}
            </span>
          </motion.div>
        )}
      </div>

      {/* ─── Notes List ─── */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-3 space-y-2">
        <AnimatePresence>
          {monthNotes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-10 text-center"
            >
              <svg
                className="w-12 h-12 mb-3"
                style={{ color: 'var(--border-color)' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                No notes yet
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                Add your first note above
              </p>
            </motion.div>
          ) : (
            monthNotes.map((note, idx) => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.03 }}
                className="note-card rounded-xl p-3"
                style={{
                  backgroundColor: 'var(--note-bg)',
                  border: '1px solid var(--note-border)',
                }}
              >
                {editingId === note.id ? (
                  /* ─── Edit Mode ─── */
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, () => saveEdit(note.id))}
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                      style={{
                        backgroundColor: 'var(--bg-tertiary)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-color)',
                      }}
                      autoFocus
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-1 text-xs rounded-lg transition-colors cursor-pointer"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveEdit(note.id)}
                        className="px-3 py-1 text-xs rounded-lg font-semibold text-white cursor-pointer"
                        style={{
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ─── View Mode ─── */
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className="text-sm flex-1 leading-relaxed"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {note.text}
                      </p>
                      <div className="flex items-center gap-1 shrink-0">
                        {/* Edit button */}
                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => startEdit(note)}
                          className="p-1.5 rounded-lg transition-colors cursor-pointer"
                          style={{ color: 'var(--text-muted)' }}
                          title="Edit note"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </motion.button>

                        {/* Delete button */}
                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(note.id)}
                          className="p-1.5 rounded-lg transition-colors cursor-pointer"
                          style={{ color: '#ef4444' }}
                          title="Delete note"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </motion.button>
                      </div>
                    </div>

                    {/* Range attachment badge */}
                    {note.range && (
                      <div className="mt-2 flex items-center gap-1.5">
                        <svg
                          className="w-3 h-3"
                          style={{ color: '#10b981' }}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span
                          className="text-xs font-medium"
                          style={{ color: '#10b981' }}
                        >
                          {formatRange(note.range)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
