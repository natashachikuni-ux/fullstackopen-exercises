// 1. Helper Components
const Header = (props) => {
  return <h1>{props.course}</h1>
}

const Part = (props) => {
  return (
    <p>
      {props.part.name} {props.part.exercises}
    </p>
  )
}

const Content = (props) => {
  // We use [0], [1], [2] to grab specific items out of the array
  return (
    <div>
      <Part part={props.parts[0]} />
      <Part part={props.parts[1]} />
      <Part part={props.parts[2]} />
    </div>
  )
}

const Total = (props) => {
  // We do math using the array items
  return (
    <p>
      Number of exercises {props.parts[0].exercises + props.parts[1].exercises + props.parts[2].exercises}
    </p>
  )
}

// 2. The Root Component
const App = () => {
  const course = 'Half Stack application development'
  
  // Here is the new Array for Exercise 1.4
  const parts = [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
  ]

  return (
    <div>
      <Header course={course} />
      {/* Now we only pass the single array! */}
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  )
}

// 3. The Export (This prevents the EOF error!)
export default App