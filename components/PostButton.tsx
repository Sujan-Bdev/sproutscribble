'use client';

import React from 'react';
import { useFormStatus } from 'react-dom';

function PostButton() {
    const {pending} = useFormStatus() 
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-blue-600 py-2 px-4 rounded-md text-white disabled:opacity-50"
    >
      Submit
    </button>
  );
}

export default PostButton;
