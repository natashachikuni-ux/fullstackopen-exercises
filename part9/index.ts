import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

// --- BMI Route ---
app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (isNaN(height) || isNaN(weight) || !height || !weight) {
    return res.status(400).send({ error: "malformatted parameters" });
  }

  const bmiStatus = calculateBmi(height, weight);

  return res.send({
    weight,
    height,
    bmi: bmiStatus
  });
});

// --- Exercises Route (Moved outside of BMI) ---
app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  if (!daily_exercises || !target) {
    return res.status(400).send({ error: "parameters missing" });
  }

  if (isNaN(Number(target)) || !Array.isArray(daily_exercises)) {
    return res.status(400).send({ error: "malformatted parameters" });
  }

  // Optional: check if every element in daily_exercises is a number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (daily_exercises.some((e: any) => isNaN(Number(e)))) {
    return res.status(400).send({ error: "malformatted parameters" });
  }

  const result = calculateExercises(daily_exercises as number[], Number(target));
  return res.send(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});