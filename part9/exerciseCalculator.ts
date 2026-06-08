interface ExerciseValues {
  target: number;
  dailyExercises: number[];
}

const parseArguments = (args: string[]): ExerciseValues => {
  if (args.length < 4) throw new Error('Not enough arguments');

  // We check if the target and the hours are actually numbers
  if (!isNaN(Number(args[2]))) {
    return {
      target: Number(args[2]),
      dailyExercises: args.slice(3).map(h => {
        if (isNaN(Number(h))) throw new Error('Provided values were not numbers!');
        return Number(h);
      })
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export const calculateExercises = (dailyHours: number[], target: number): Result => {
  const periodLength = dailyHours.length;
  const trainingDays = dailyHours.filter(h => h > 0).length;
  const average = dailyHours.reduce((a, b) => a + b, 0) / periodLength;
  const success = average >= target;

  let rating;
  let ratingDescription;

  if (average < target) {
    rating = 1;
    ratingDescription = 'bad, you should try harder';
  } else if (average === target) {
    rating = 2;
    ratingDescription = 'not too bad but could be better';
  } else {
    rating = 3;
    ratingDescription = 'great job, keep it up';
  }

  return { periodLength, trainingDays, success, rating, ratingDescription, target, average };
};

if (require.main === module) {
  try {
    const { target, dailyExercises } = parseArguments(process.argv);
    console.log(calculateExercises(dailyExercises, target));
  } catch (error: unknown) {
    let errorMessage = 'Something bad happened.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
  }
}