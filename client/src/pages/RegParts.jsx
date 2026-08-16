import { useState, useEffect } from "react";
import { API_URL } from "../config/api";
import { Link, useNavigate } from "react-router-dom";

export default function RegParts() {
    const navigate = useNavigate();
    const [suppliers, setSuppliers] = useState([]);
    const [oemCode, setOemCode] = useState("");
    const [category, setCategory] = useState("");
    const [partName, setPartName] = useState("");
    const [unitCost, setUnitCost] = useState("");
    const [sellingPrice, setSellingPrice] = useState("");
    const [stockQuantity, setStockQuantity] = useState("");
    const [reorderThreshold, setReorderThreshold] = useState("5");
    const [supplierId, setSupplierId] = useState("");
    const [message, setMessage] = useState("");

    const fetchSuppliers = async () => {
        setMessage("");
        try {
            const response = await fetch(`${API_URL}/suppliers`);
            const data = await response.json();
            if (response.ok) {
                setSuppliers(data.suppliers || []);
            }
        } catch (err) {
            setMessage("Failed to fetch suppliers");
            console.error(err);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const handleCreatePart = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!oemCode || !partName || !unitCost || !sellingPrice || !supplierId) {
            setMessage("Please fill in all required fields.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/parts`, {
                method: 'POST',
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    oem_code: oemCode,
                    part_name: partName,
                    category: category,
                    unit_cost: Number(unitCost),
                    selling_price: Number(sellingPrice),
                    stock_quantity: Number(stockQuantity) || 0,
                    reorder_threshold: Number(reorderThreshold) || 5,
                    supplier_id: Number(supplierId),
                }),
            });

            const data = await response.json();
            if (data.success) {
                setMessage("");
                navigate("/parts");
            } else {
                setMessage(data.message || "Failed to add part.");
            }
        } catch (err) {
            setMessage("Error connecting to server.");
            console.error(err);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.headerRow}>
                <h2>Register New Part</h2>
                <Link to="/parts" style={styles.backButton}>
                    &larr; Back to Parts
                </Link>
            </div>

            
            {message && <p style={styles.error}>{message}</p>}

            <form onSubmit={handleCreatePart} style={styles.formCard}>
                <h3 style={styles.formTitle}>Add New Part</h3>
                <div style={styles.formGrid}>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>OEM Code</label>
                        <input type="text" value={oemCode} onChange={(e) => setOemCode(e.target.value)} style={styles.input} />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Part Name</label>
                        <input type="text" value={partName} onChange={(e) => setPartName(e.target.value)} style={styles.input} />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Category</label>
                        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} style={styles.input} />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Supplier</label>
                        <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} style={styles.input}>
                            <option value="">Select a supplier...</option>
                            {suppliers.map((s) => (
                                <option key={s.id} value={s.id}>{s.company_name}</option>
                            ))}
                        </select>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Unit Cost (€)</label>
                        <input type="number" step="0.01" value={unitCost} onChange={(e) => setUnitCost(e.target.value)} style={styles.input} />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Selling Price (€)</label>
                        <input type="number" step="0.01" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} style={styles.input} />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Stock Quantity</label>
                        <input type="number" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} style={styles.input} />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Reorder Threshold</label>
                        <input type="number" value={reorderThreshold} onChange={(e) => setReorderThreshold(e.target.value)} style={styles.input} />
                    </div>

                </div>
                <button type="submit" style={styles.addButton}>Add Part</button>
            </form>
        </div>
    );
}

const styles = {
    container: { 
        padding: "24px",
        color: "#fff",
        maxWidth: "800px", 
        margin: "0 auto" 
    },
    headerRow: { 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "20px" 
    },
    backButton: { 
        padding: "8px 14px", 
        background: "#334155", 
        color: "#f8fafc", 
        border: "1px solid #475569", 
        borderRadius: "6px", 
        textDecoration: "none", 
        fontSize: "14px", 
        fontWeight: "600" 
    },
    error: { 
        color: "#f87171", 
        marginBottom: "16px",
        fontWeight: "600"
    },
    formCard: { 
        background: "#1e293b", 
        padding: "24px", 
        borderRadius: "8px", 
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)" 
    },
    formTitle: { 
        fontSize: "18px", 
        marginBottom: "16px", 
        color: "#f8fafc" 
    },
    formGrid: { 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", 
        gap: "16px", 
        marginBottom: "20px" 
    },
    formGroup: { 
        display: "flex", 
        flexDirection: "column" 
    },
    label: { 
        fontSize: "13px", 
        fontWeight: "600", 
        marginBottom: "6px", 
        color: "#94a3b8" 
    },
    input: { 
        width: "100%", 
        padding: "10px", 
        background: "#0f172a", 
        border: "1px solid #334155", 
        borderRadius: "4px", 
        color: "#fff", 
        fontSize: "14px", 
        boxSizing: "border-box" 
    },
    addButton: { 
        padding: "12px 20px", 
        background: "#2563eb", 
        color: "#fff", 
        border: "none", 
        borderRadius: "4px", 
        cursor: "pointer", 
        fontWeight: "bold", 
        width: "100%" 
    }
};