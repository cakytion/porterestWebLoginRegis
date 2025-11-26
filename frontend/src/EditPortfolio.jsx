import { useState, useEffect } from "react";
import { getPortfolio, updatePortfolio, deletePortfolio } from "./api/portfolio.js";

export default function EditPortfolio({ id }) {
  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {
    getPortfolio(id).then(setPortfolio);
  }, []);

  const saveChanges = async () => {
    await updatePortfolio(id, {
      title: portfolio.title,
      description: portfolio.description,
    });
    alert("Updated!");
  };

  const removePortfolio = async () => {
    await deletePortfolio(id);
    alert("Deleted!");
  };

  if (!portfolio) return "Loading...";

  return (
    <div>
      <h1>Edit Portfolio</h1>

      <label>Title</label>
      <input
        value={portfolio.title}
        onChange={(e) =>
          setPortfolio({ ...portfolio, title: e.target.value })
        }
      />

      <label>Description</label>
      <textarea
        value={portfolio.description}
        onChange={(e) =>
          setPortfolio({ ...portfolio, description: e.target.value })
        }
      />

      <button onClick={saveChanges}>Save</button>
      <button onClick={removePortfolio}>Delete</button>
    </div>
  );
}