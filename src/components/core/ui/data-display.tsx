export const DataDisplay = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => {
  return (
    <div>
      <div>
        <span className="uppercase text-slate-500">{title}</span>
      </div>
      <div>
        <span className="font-medium uppercase">{content}</span>
      </div>
    </div>
  );
};
