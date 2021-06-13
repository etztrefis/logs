import { FC, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import AutoComplete from "react-autocomplete";
import { classNames } from "../utils";

const Search: FC<{ className?: string }> = ({ className, children }) => {
  const [value, setValue] = useState();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data: any) => console.log(data);
  const defaultRef = useRef();
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full mx-auto px-6 md:px-10">
        <div>
          <label
            htmlFor="Channel"
            className="block text-xs leading-5 font-bold text-gray-700 uppercase"
          >
            Channel
          </label>
          <AutoComplete
            key="Channel"
            wrapperProps={{ className: `w-full` }}
            inputProps={{
              className: `px-3 py-3 relative w-full rounded-md 
          border border-gray-300 bg-white focus:outline-none  
          focus:border-primary transition ease-in-out 
          duration-200 sm:text-sm sm:leading-5 mt-1 shadow-sm`,
            }}
            autoHighlight={true}
            items={[{ label: "apple" }, { label: "banana" }, { label: "pear" }]}
            getItemValue={(item) => item.locality}
            renderMenu={(items, value, style) => {
              if (items.length > 0) {
                return (
                  <div
                    className="bg-white w-64 fixed mt-1 max-h-60 rounded-md py-1 text-base leading-6 shadow-lg overflow-auto focus:outline-none sm:text-sm sm:leading-5"
                    style={{ ...style, zIndex: 100 }}
                  >
                    <div>{items}</div>
                  </div>
                );
              } else {
                return <div></div>;
              }
            }}
            renderItem={(item: any, isHighlighted) => {
              return (
                <div
                  key={item.label}
                  className={classNames(
                    isHighlighted
                      ? "text-white bg-primary-light"
                      : "text-gray-900",
                    "cursor-pointer select-none relative py-2 pr-4 font-normal",
                  )}
                >
                  <span className="pl-2 items-center flex truncate">
                    {item.label}
                  </span>
                  {value === item.label && (
                    <span
                      className={`${
                        value === item.label ? "text-white" : "bg-primary-light"
                      } absolute inset-y-0 left-0 flex items-center pl-1.5`}
                    ></span>
                  )}
                </div>
              );
            }}
            value={watch("channel", value)}
            // onSelect={}
            {...register("channel", {required: true})}
          />
          {errors.locality && (
              <p className="text-sm text-gray-500 mt-2" id="name-error">
                Please select suburb.
              </p>
            )}
        </div>
      </div>
      {/* TODO: user, date range(after, before) */}
    </form>
  );
};

export default Search;
