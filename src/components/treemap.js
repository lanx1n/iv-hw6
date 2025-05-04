import React from "react";
import { treemap, hierarchy, scaleOrdinal, schemeDark2 } from "d3";


export function TreeMap(props) {
    const { margin, svg_width, svg_height, tree, selectedCell, setSelectedCell } = props;

    // 1. 设置画布内部大小
    const innerWidth = svg_width - margin.left - margin.right;
    const innerHeight = svg_height - margin.top - margin.bottom;

    // 2. 构建层级结构并应用 treemap 布局
    const root = hierarchy(tree).sum(d => d.value);
    const layout = treemap().size([innerWidth, innerHeight]).padding(1);
    layout(root);

    // 3. 定义颜色映射
    const color = scaleOrdinal(schemeDark2);

    return (
        <svg
            width={svg_width}
            height={svg_height}
        >
            <g transform={`translate(${margin.left}, ${margin.top})`}>
                {root.leaves().map((node, i) => (
                    <g key={i}>
                        <rect
                            x={node.x0}
                            y={node.y0}
                            width={node.x1 - node.x0}
                            height={node.y1 - node.y0}
                            fill={color(node.data.name)}
                            stroke="white"
                            onClick={() => setSelectedCell(node.data.name)}
                            style={{ cursor: "pointer" }}
                        />
                        <Text node={node} />
                    </g>
                ))}
            </g>
        </svg>
    );
}
