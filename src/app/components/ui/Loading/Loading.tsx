import "./loading.css";

const Loading = () => {
  return (
    <div className="fixed w-screen h-screen flex justify-center items-center bg-black bg-opacity-50 z-[100] top-0 left-0">
      <div className="wrapper">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="shadow"></div>
        <div className="shadow"></div>
        <div className="shadow"></div>
      </div>
    </div>
  );
};

export default Loading;
