import React from 'react';

function renderTree( nestedData, onClick ) { 
    return (
        <ul>
            {nestedData.map((item) => (
                <li key={item.id}>
                    {item.children.length === 0 ? (
                        <button onClick={() => onClick(item)}>{`${item.order} - ${item.name}`}</button>
                    ) : (
                        item.name
                    )}
                    {item.children.length > 0 && renderTree(item.children, onClick)}
					<button>Edit</button>
                </li>
            ))}
        </ul>
    );
}

function TreeMenu(props) {
    const { nestedData, onClick } = props;
    return <div className="mainmenu">{renderTree(nestedData, onClick)}</div>;
}

export default TreeMenu;
