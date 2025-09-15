interface InputProps {
  setMsg: React.Dispatch<React.SetStateAction<string>>;
  className?: string; // 👈 add this
  value?: string;
}
export const Input = ({ setMsg, className, value }: InputProps) => {
  return (
    <div className="text-3xl w-full">
      <input
        value={value}
        type="text"
        id="first_name"
        className={`w-full  text-black text-sm border-2 border-gray-400 hover:border-pink-400 focus:outline-none
 rounded-full px-3 py-2 transition duration-200 ease focus:border-[#2CFF05] shadow-sm focus:shadow ${
   className ?? ""
 }`} // 👈 use it
        onChange={(e) => {
          setMsg(e.target.value);
        }}
      />
    </div>
  );
};
