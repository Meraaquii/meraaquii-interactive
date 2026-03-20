// Components/Pages/DeviceList.jsx
import Table from "../Table/Table";

export default function DeviceList() {
  return (
    <>
      <div className="page-title">
        <h2>Device List</h2>
      </div>
      <Table rows={[]} />
    </>
  );
}
