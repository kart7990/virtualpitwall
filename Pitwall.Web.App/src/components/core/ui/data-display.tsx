export const DataDisplay = ({
  title,
  content,
  contentClassNames,
}: {
  title: string;
  content: string;
  contentClassNames?: string;
}) => {
  return (
    <div>
      <div>
        <span className="uppercase text-slate-500">{title}</span>
      </div>
      <div>
        <span className={`font-medium uppercase ${contentClassNames || ""}`}>
          {content}
        </span>
      </div>
    </div>
  );
};
