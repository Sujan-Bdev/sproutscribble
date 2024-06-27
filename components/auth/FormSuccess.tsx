import { CheckCircle2 } from 'lucide-react';

function FormSuccess({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="bg-teal-400 flex items-center gap-2  font-medium text-sm my-4 text-secondary-foreground p-3 rounded-md">
      <CheckCircle2 className="w-4 h-4" />
      <p>{message} </p>
    </div>
  );
}

export default FormSuccess;
