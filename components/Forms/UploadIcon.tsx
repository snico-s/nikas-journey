import React, { useEffect, useState } from "react";

function UploadIcon(props: Props) {
  const [isLoading, setIsLoading] = useState(props.isLoading);
  const [isSuccess, setIsSuccess] = useState(props.isSuccess);

  useEffect(() => {
    setIsLoading(props.isLoading);
    setIsSuccess(props.isSuccess);
  }, [props.isLoading, props.isSuccess]);

  if (isLoading) return <span>⌛</span>;
  if (isSuccess) return <span>✅</span>;
  return <span>❌</span>;
}

type Props = {
  isLoading: boolean;
  isSuccess: boolean;
};

export default UploadIcon;
