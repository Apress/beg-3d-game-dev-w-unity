Shader "Custom/DS-Blackhole" {
	Properties {
		_Color ("Main Color", Color) = (1,1,1,1)

	}
	SubShader {
	Cull Off
		UsePass "Lightmapped/VertexLit/BASE"
		UsePass "Diffuse/PPL"
	}
	
	FallBack "Lightmapped/VertexLit", 1
}