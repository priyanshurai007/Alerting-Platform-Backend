import express from 'express';
import { admin } from './routes/admin';
import { user } from './routes/user';
import { reminders } from './routes/reminders';
import { analytics } from './routes/analytics';
import { db } from './store';
import { v4 as uuid } from 'uuid';
import cors from "cors";



const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",                            // local dev
    "https://alerting-platform-kxsm.onrender.com"       // deployed frontend
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));


app.use(express.json());

app.get('/', (_req, res) => res.json({ ok: true }));

app.use('/admin', admin);
app.use('/user', user);
app.use('/reminders', reminders);
app.use('/analytics', analytics);

// seed minimal data if empty
app.post('/seed', (_req, res) => {
  if (db.teams.length === 0) {
    db.teams.push({ id: 't-eng', name: 'Engineering' }, { id: 't-mkt', name: 'Marketing' });
  }
  if (db.users.length === 0) {
    db.users.push(
      { id: 'u-alex', name: 'Alex', teamId: 't-eng' },
      { id: 'u-bella', name: 'Bella', teamId: 't-mkt' },
      { id: 'u-chen', name: 'Chen', teamId: 't-eng' }
    );
  }
  res.json({ teams: db.teams, users: db.users });
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Alerting Platform listening on http://localhost:${PORT}`);
});
