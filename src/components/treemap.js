import React from "react";
import { treemap, hierarchy, scaleOrdinal, schemeDark2 } from "d3";

export function TreeMap(props) {
    const {
        margin,
        svg_width,
        svg_height,
        tree,
        selectedCell,
        setSelectedCell
    } = props;

    const innerWidth = svg_width - margin.left - margin.right;
    const innerHeight = svg_height - margin.top - margin.bottom;

    const root = hierarchy(tree)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

    treemap()
        .size([innerWidth, innerHeight])
        .padding(2)(root);

    const color = scaleOrdinal(schemeDark2);

    return (
        <svg width={svg_width} height={svg_height}>
            <g transform={`translate(${margin.left}, ${margin.top})`}>
                {root.leaves().map((node, i) => {
                    const { x0, y0, x1, y1, data } = node;
                    const width = x1 - x0;
                    const height = y1 - y0;

                    // ✅ 从真实字段中取值
                    const attrKey = data.attr || "unknown";
                    const attrVal = data.name || "N/A";

                    return (
                        <g key={i}>
                            <rect
                                x={x0}
                                y={y0}
                                width={width}
                                height={height}
                                fill={color(attrVal)}
                                stroke="#000"
                                strokeWidth={1}
                                onClick={() => setSelectedCell?.(data)}
                                style={{ cursor: "pointer" }}
                            />

                            {/* 左上角文字 */}
                            <text x={x0 + 4} y={y0 + 14} fontSize={12} fill="white">
                                {attrKey}: {attrVal}
                            </text>
                            <text x={x0 + 4} y={y0 + 28} fontSize={12} fill="white">
                                Value: {data.value}%
                            </text>

                            {/* 中心淡色大号文字 */}
                            <text
                                x={(x0 + x1) / 2}
                                y={(y0 + y1) / 2}
                                fontSize={24}
                                fontWeight="bold"
                                textAnchor="middle"
                                alignmentBaseline="middle"
                                fill="rgba(0,0,0,0.2)"
                            >
                                {attrKey}: {attrVal}
                            </text>
                        </g>
                    );
                })}
            </g>
        </svg>
    );
}
