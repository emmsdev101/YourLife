import React from 'react'
import style from './style.module.css'
export default function LoadMoreButton({onClick}) {
    return (
        <button className = {style.loadMore} onClick = {onClick}>
            Load more
        </button>
    )
}
