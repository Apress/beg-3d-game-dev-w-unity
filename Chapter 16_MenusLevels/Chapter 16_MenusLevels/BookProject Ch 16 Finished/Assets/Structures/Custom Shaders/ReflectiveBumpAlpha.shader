Shader "Custom/ReflectiveAlpha"
{
	Properties 
	{
_Color("_Color", Color) = (0.1791045,1,0.4489094,1)
_SpecularColor("_SpecularColor", Color) = (1,1,1,1)
_ReflectColor("_ReflectColor", Color) = (1,1,1,1)
_Shininess("_Shininess", Range(0,1) ) = 0.5
_MainTex("_MainTex", 2D) = "black" {}
_BumpMap("_BumpMap", 2D) = "black" {}
_Cube("_Cube", Cube) = "black" {}
_SpecAmount("_SpecAmount", Range(0,1) ) = 0.5

	}
	
	SubShader 
	{
		Tags
		{
"Queue"="Transparent"
"IgnoreProjector"="False"
"RenderType"="Transparent"

		}

		
Cull Off
ZWrite On
ZTest LEqual
ColorMask RGBA
Fog{
}


		CGPROGRAM
#pragma surface surf BlinnPhongEditor  addshadow alpha decal:blend vertex:vert
#pragma target 2.0


float4 _Color;
float4 _SpecularColor;
float4 _ReflectColor;
float _Shininess;
sampler2D _MainTex;
sampler2D _BumpMap;
samplerCUBE _Cube;
float _SpecAmount;

			struct EditorSurfaceOutput {
				half3 Albedo;
				half3 Normal;
				half3 Emission;
				half3 Gloss;
				half Specular;
				half Alpha;
				half4 Custom;
			};
			
			inline half4 LightingBlinnPhongEditor_PrePass (EditorSurfaceOutput s, half4 light)
			{
half3 spec = light.a * s.Gloss;
half4 c;
c.rgb = (s.Albedo * light.rgb + light.rgb * spec);
c.a = s.Alpha;
return c;

			}

			inline half4 LightingBlinnPhongEditor (EditorSurfaceOutput s, half3 lightDir, half3 viewDir, half atten)
			{
				half3 h = normalize (lightDir + viewDir);
				
				half diff = max (0, dot ( lightDir, s.Normal ));
				
				float nh = max (0, dot (s.Normal, h));
				float spec = pow (nh, s.Specular*128.0);
				
				half4 res;
				res.rgb = _LightColor0.rgb * diff;
				res.w = spec * Luminance (_LightColor0.rgb);
				res *= atten * 2.0;

				return LightingBlinnPhongEditor_PrePass( s, res );
			}
			
			struct Input {
				float2 uv_MainTex;
float2 uv_BumpMap;

			};

			void vert (inout appdata_full v, out Input o) {
float4 VertexOutputMaster0_0_NoInput = float4(0,0,0,0);
float4 VertexOutputMaster0_1_NoInput = float4(0,0,0,0);
float4 VertexOutputMaster0_2_NoInput = float4(0,0,0,0);
float4 VertexOutputMaster0_3_NoInput = float4(0,0,0,0);


			}
			

			void surf (Input IN, inout EditorSurfaceOutput o) {
				o.Normal = float3(0.0,0.0,1.0);
				o.Alpha = 1.0;
				o.Albedo = 0.0;
				o.Emission = 0.0;
				o.Gloss = 0.0;
				o.Specular = 0.0;
				o.Custom = 0.0;
				
float4 Tex2D0=tex2D(_MainTex,(IN.uv_MainTex.xyxy).xy);
float4 Multiply0=_Color * Tex2D0;
float4 Tex2DNormal0=float4(UnpackNormal( tex2D(_BumpMap,(IN.uv_BumpMap.xyxy).xy)).xyz, 1.0 );
float4 TexCUBE0_1_NoInput = float4(0,0,1,1);
float4 TexCUBE0=texCUBE(_Cube,TexCUBE0_1_NoInput);
float4 Multiply2=_ReflectColor * TexCUBE0;
float4 Add0=_SpecularColor + _SpecAmount.xxxx;
float4 Master0_7_NoInput = float4(0,0,0,0);
float4 Master0_6_NoInput = float4(1,1,1,1);
o.Albedo = Multiply0;
o.Normal = Tex2DNormal0;
o.Emission = Multiply2;
o.Specular = _Shininess.xxxx;
o.Gloss = Add0;
o.Alpha = Tex2D0.aaaa;

				o.Normal = normalize(o.Normal);
			}
		ENDCG
	}
	Fallback "Diffuse"
}