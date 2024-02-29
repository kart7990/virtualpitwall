const SimpleTable = ({
  headers,
  data,
}: {
  headers: string[];
  data: any[][];
}) => {
  return (
    <table className="border-collapse border-slate-500">
      <thead>
        <tr className="border-b-2">
          {headers.map((header, index) => (
            <th className="p-1" key={index}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((lap, index) => (
          <tr className="border-b-2" key={index}>
            {lap.map((column, i) => (
              <td className="p-1" key={i}>
                {column}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SimpleTable;
