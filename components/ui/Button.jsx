"use client";
import Link from "next/link";

const shadowStyles = {
  primary: {
    boxShadow: `
      0 1px 0 0 rgba(38, 38, 38, 0.9),
      0 2px 0 0 rgba(38, 38, 38, 0.7),
      0 3px 0 0 rgba(38, 38, 38, 0.5),
      0 4px 0 0 rgba(38, 38, 38, 0.3),
      0 5px 12px rgba(38, 38, 38, 0.2)
    `,
  },
  outline: {
    boxShadow: `0 2px 8px rgba(0, 0, 0, 0.08)`,
  },
  ghost: {},
};

const loaderStyles = `
  @keyframes flash {
    0% {
      background-color: #FFF2;
      box-shadow: 10px 0 #FFF2, -10px 0 #FFF;
    }
    50% {
      background-color: #FFF;
      box-shadow: 10px 0 #FFF2, -10px 0 #FFF2;
    }
    100% {
      background-color: #FFF2;
      box-shadow: 10px 0 #FFF, -10px 0 #FFF2;
    }
  }

  .btn-loader {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: #fff;
    box-shadow: 10px 0 #fff, -10px 0 #fff;
    position: relative;
    animation: flash 0.8s ease-out infinite alternate;
  }

  .btn-loader-dark {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: #262626;
    box-shadow: 10px 0 #262626, -10px 0 #262626;
    position: relative;
    animation: flash-dark 0.5s ease-out infinite alternate;
  }

  @keyframes flash-dark {
    0% {
      background-color: rgba(38,38,38,0.2);
      box-shadow: 10px 0 rgba(38,38,38,0.2), -10px 0 rgba(38,38,38,1);
    }
    50% {
      background-color: rgba(38,38,38,1);
      box-shadow: 10px 0 rgba(38,38,38,0.2), -10px 0 rgba(38,38,38,0.2);
    }
    100% {
      background-color: rgba(38,38,38,0.2);
      box-shadow: 10px 0 rgba(38,38,38,1), -10px 0 rgba(38,38,38,0.2);
    }
  }
`;

function Button({
  children,
  callback,
  href,
  type = "primary",
  disabled = false,
  loading = false,
  buttonType = "button",
  className = "",
  onClick,
}) {
  const baseStyles =
    "relative flex items-center justify-center gap-1.5 rounded-lg transition-all duration-200";

  const typeStyles = {
    primary: `bg-brand-black text-white px-4 py-2 text-sm  ${!loading && "hover:bg-black"}`,
    outline: `bg-white text-brand-black border border-black/[0.09] px-4 py-2 text-sm  cursor-pointer ${!loading && "hover:border-black/[0.18]"}`,
    ghost: `bg-brand-gray/20 text-brand-black px-2.5 py-1 text-[11px] font-semibold ${!loading && "hover:bg-brand-black hover:text-white"} transition-all duration-200`,
  };

  const shadow = !disabled ? shadowStyles[type] : {};

  const combinedClassName = `${baseStyles} ${typeStyles[type]} ${
    disabled || loading ? "cursor-not-allowed opacity-95" : ""
  } ${className}`;

  const content = (
    <>
      <span
        className={`flex items-center gap-1.5 ${loading ? "invisible" : ""}`}
      >
        {children}
      </span>
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span
            className={type === "outline" ? "btn-loader-dark" : "btn-loader"}
          />
        </span>
      )}
    </>
  );

  return (
    <>
      <style>{loaderStyles}</style>
      {href ? (
        <Link
          href={href}
          style={shadow}
          className={combinedClassName}
          onClick={onClick || callback}
        >
          {content}
        </Link>
      ) : (
        <button
          type={buttonType}
          disabled={disabled || loading}
          onClick={onClick || callback}
          style={shadow}
          className={combinedClassName}
        >
          {content}
        </button>
      )}
    </>
  );
}

export default Button;
