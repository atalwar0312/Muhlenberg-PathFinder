import express from 'express';
import { fileURLToPath } from 'node:url';
import { sampleRepository } from './data/sample.js';

export function createApp(supabase, repository = sampleRepository) {
  const app = express();
  app.disable('x-powered-by');
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', course_source: 'supabase', student_source: 'sample', database_status: 'not_checked' });
  });
  app.get('/api/students/:id', async (req, res) => {
    const student = await repository.getStudent(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json({ data_source: 'sample', data: student });
  });
  app.get('/api/courses', async (req, res) => {
    const q = req.query.q ?? '';
    if (typeof q !== 'string' || q.length > 200) {
      return res.status(400).json({ error: 'q must be a single string of at most 200 characters' });
    }
    try {
      let query = supabase.from('courses')
        .select('id,prefix,number,name,units,prerequisites_text,description,gar')
        .order('id', { ascending: true }).limit(100);
      if (q.trim()) query = query.ilike('name', `%${q.trim()}%`);
      const { data, error } = await query;
      if (error) throw error;
      res.json({ data_source: 'supabase', data });
    } catch (error) {
      console.error('Course query failed:', error.message);
      res.status(502).json({ error: 'Unable to retrieve courses from the database' });
    }
  });
  app.get('/api/courses/:id', async (req, res) => {
    const course = await repository.getCourse(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json({ data_source: 'sample', data: course });
  });
  // Serve only the frontend directory, never the repository or environment files.
  app.use(express.static(fileURLToPath(new URL('../../frontend/UI/', import.meta.url))));
  app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
  app.use((err, req, res, next) => {
    console.error('Request failed:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  });
  return app;
}
