import { useState, useEffect } from "react";

const Loading = () => {

  const [seconds, setSeconds] = useState(40);

  useEffect(() => {
    if (seconds > 0) {
      const timerId = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [seconds]);

  return (
    <div className="flex flex-wrap gap-4 items-center z-10 inset-0 fixed  bg-opacity-25 backdrop-blur-md justify-center">
      <div className="flex flex-col">
        <div className="flex flex-row items-center gap-4">
          <div className="w-14 h-14 border-8 border-dashed rounded-full animate-spin border-indigo-400"></div>
          <div className="text-xl font-semibold font-headerFonts text-gray-600">
            Connecting to Server ...
            <div className="text-sm text-gray-600 font-semibold font-headerFonts">
              <p>
                Please wait for {seconds}s. Server instance may have spun down
                due to inactivity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
