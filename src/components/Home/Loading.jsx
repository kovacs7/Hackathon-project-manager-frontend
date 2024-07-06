const Loading = () => {
  return (
    <div className="flex flex-wrap gap-4 items-center z-10 inset-0 fixed  bg-opacity-25 backdrop-blur-md justify-center">
      <div className="w-14 h-14 border-8 border-dashed rounded-full animate-spin border-indigo-400"></div>
      <p className="text-xl font-semibold font-headerFonts text-gray-600">
        Connecting to Server ...
      </p>
    </div>
  );
}

export default Loading