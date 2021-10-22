import React from "react";
import style from "./style.module.css";

export default function alert({confirm, cancel, message}) {
  return (
    <div className={style.alert}>
      <div className={style.alertBox}>
        <div className={style.alertHeader}>
          <p>{message}</p>
        </div>
        <div className = {style.alertDivider}>
        </div>
        <div className = {style.alertFooter}>
            <button className = {style.alertConfirm} onClick = {confirm}>Logout</button>
            <button className = {style.alertCancel} onClick = {cancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
