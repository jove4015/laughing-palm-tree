import Link from "next/link";

interface ErrorComponentProps {
  setErrorState(): void;
}

export default function ErrorComponent({ setErrorState }: ErrorComponentProps) {
  return (
    <div className="errorMessageWrapper">
      <div className="errorMessageText">
        <h6>
          <b>Oops! An error has occured on our side.</b>
        </h6>
        <p>
          <Link href="/" onClick={setErrorState}>
            Click Here
          </Link>{" "}
          to return back to the Homepage.
        </p>
      </div>
    </div>
  );
}
