const Note = require('../models/Note');

/**
 * GET /api/notes
 * Get all notes for the authed user
 */
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.userId })
      .sort({ pinned: -1, createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error('getNotes error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * POST /api/notes
 * Create a note for the authed user
 */
exports.createNote = async (req, res) => {
  try {
    const { title, content, pinned } = req.body || {};
    const note = await Note.create({
      user: req.userId,
      title: (title || '').trim() || 'Untitled',
      content: content || '',
      pinned: !!pinned,
    });
    res.status(201).json(note);
  } catch (err) {
    console.error('createNote error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * PUT /api/notes/:id
 * Update a note (only owner)
 */
exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findOne({ _id: id, user: req.userId });
    if (!note) return res.status(404).json({ message: 'Note not found' });

    const { title, content, pinned } = req.body || {};
    if (typeof title !== 'undefined') note.title = title;
    if (typeof content !== 'undefined') note.content = content;
    if (typeof pinned !== 'undefined') note.pinned = pinned;

    await note.save();
    res.json(note);
  } catch (err) {
    console.error('updateNote error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * DELETE /api/notes/:id
 * Delete a note (only owner)
 */
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Note.findOneAndDelete({ _id: id, user: req.userId });
    if (!deleted) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('deleteNote error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
