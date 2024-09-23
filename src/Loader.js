
import LoaderSpin from "../src/assets/loader.svg";
const Loader = () => {
    return (
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 mt-32">
        <img src={LoaderSpin} className="loadercss"></img>
      </div>
    );
  };
  
  export default Loader;