// Components/Pages/CustomerList.jsx
import Table from "../Table/Table";

export default function CustomerList() {
  return (
    <>
      <div className="page-title">
        <h2>Customer List</h2>
      </div>
      <Table rows={[]} />
    </>
  );
}
