import { useSelector } from "react-redux";
import EnhancedTable from "../../components/table/EnhancedTable";
import "../../styles/Assets/AssetsPage.css";
import EmptyAssetPage from "./EmptyAssetPage";
import { useState, useEffect } from "react";
import SkeletonLoader from "../../components/common/skeletonLoader";

const AssetPage = () => {
  const reduxData = useSelector((state) => state.upload.tableData);
  const reduxColumns = useSelector((state) => state.upload.tableColumns);

  const [data, setData] = useState([]);

  // 🔥 Fetch from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/assets")
      .then((res) => res.json())
      .then((res) => {
        console.log("Assets API:", res);
        setData(res);
      })
      .catch((err) => console.log(err));
  }, []);

  // 🔥 Use DB data, fallback Redux
  const tableData = data.length > 0 ? data : reduxData || [];

  // 🔥 Columns fix (IMPORTANT)
  const tableColumns =
    reduxColumns && reduxColumns.length > 0
      ? reduxColumns
      : [
          { id: "assetId", label: "Asset ID" },
          { id: "assetName", label: "Asset Name" },
          { id: "itemNumber", label: "Item Number" },
          { id: "owner", label: "Owner" },
          { id: "riskEngineer", label: "Risk Engineer" },
          { id: "createdDate", label: "Created Date" },
          { id: "dueDate", label: "Due Date" },
          { id: "daysRemaining", label: "Days Remaining" },
        ];

  console.log("AssetPage - tableData:", tableData);

  return (
    <div>
      <div className="ph">
        <div className="ph-title">Assets</div>
        <div className="ph-sub">
          All {tableData.length} tracked assets with due date monitoring
        </div>
      </div>
      {tableData.length > 0 ? (
        <div style={{ marginTop: 16 }}>
          <EnhancedTable
            rows={tableData}
            headCells={tableColumns}
            title={` Assets Registered - ${tableData.length} `}
          />
        </div>
      ) : (
        <div style={{ marginTop: 32 }}>
          {/* <EmptyAssetPage />  */}
          <SkeletonLoader height={200} width={"100%"} borderRadius={8} />
        </div>
      )}
    </div>
  );
};

export default AssetPage;
