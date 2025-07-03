import { useEffect, useState } from "react";
import './styles.css';

export  default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formattedTime = time.toLocaleTimeString();

  return (
    <div className="dsc-section-title">
      <h1>Horário: {formattedTime}</h1>
    </div>
  );
}

