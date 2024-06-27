import { AlertCircle } from 'lucide-react';
import React from 'react';

function FormError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="bg-destructive flex items-center gap-2 text-sm my-4 font-medium text-secondary-foreground p-3 rounded-md">
      <AlertCircle className="w-4 h-4" />
      <p>{message} </p>
    </div>
  );
}

export default FormError;
