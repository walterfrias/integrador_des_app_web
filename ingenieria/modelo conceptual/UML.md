<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net">
  <diagram name="Página-1" id="Nz0XShlxsaZKFTDmnEcY">
    <mxGraphModel dx="1406" dy="746" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <mxCell id="etyIAacoGwPMTgbXiI6D-11" edge="1" parent="1" source="etyIAacoGwPMTgbXiI6D-2" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;entryX=-0.011;entryY=0.533;entryDx=0;entryDy=0;entryPerimeter=0;endArrow=none;endFill=0;startArrow=diamond;startFill=1;" target="etyIAacoGwPMTgbXiI6D-3">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="580" y="495" />
              <mxPoint x="580" y="495" />
            </Array>
          </mxGeometry>
        </mxCell>
        <mxCell id="etyIAacoGwPMTgbXiI6D-2" parent="1" style="verticalAlign=top;align=left;overflow=fill;html=1;whiteSpace=wrap;" value="&lt;p style=&quot;margin:0px;margin-top:4px;text-align:center;&quot;&gt;&lt;b&gt;Proyecto&lt;/b&gt;&lt;/p&gt;&lt;hr size=&quot;1&quot; style=&quot;border-style:solid;&quot;&gt;&lt;p style=&quot;margin:0px;margin-left:4px;&quot;&gt;+ nombreProyecto: String;&lt;/p&gt;&lt;p style=&quot;margin:0px;margin-left:4px;&quot;&gt;+ estadoproyecto: Enum;&lt;/p&gt;&lt;hr size=&quot;1&quot; style=&quot;border-style:solid;&quot;&gt;&lt;p style=&quot;margin:0px;margin-left:4px;&quot;&gt;+ crearProyecto()&lt;/p&gt;&lt;p style=&quot;margin:0px;margin-left:4px;&quot;&gt;+ consultarProyecto()&lt;/p&gt;&lt;p style=&quot;margin:0px;margin-left:4px;&quot;&gt;+ modificarProyecto()&lt;/p&gt;&lt;p style=&quot;margin:0px;margin-left:4px;&quot;&gt;+ consultarTareas()&lt;/p&gt;&lt;p style=&quot;margin:0px;margin-left:4px;&quot;&gt;+ consultarCliente()&lt;/p&gt;&lt;p style=&quot;margin:0px;margin-left:4px;&quot;&gt;+ cambiarEstado()&lt;/p&gt;&lt;p style=&quot;margin:0px;margin-left:4px;&quot;&gt;+ asociarCliente()&lt;/p&gt;" vertex="1">
          <mxGeometry height="200" width="160" x="400" y="420" as="geometry" />
        </mxCell>
        <mxCell id="etyIAacoGwPMTgbXiI6D-3" parent="1" style="verticalAlign=top;align=left;overflow=fill;html=1;whiteSpace=wrap;" value="&lt;p style=&quot;margin:0px;margin-top:4px;text-align:center;&quot;&gt;&lt;b&gt;Tarea&lt;/b&gt;&lt;/p&gt;&lt;hr size=&quot;1&quot; style=&quot;border-style:solid;&quot;&gt;&lt;p style=&quot;margin:0px;margin-left:4px;&quot;&gt;+ descripcionTarea: String;&lt;/p&gt;&lt;p style=&quot;margin:0px;margin-left:4px;&quot;&gt;+ estadoTarea: Enum;&lt;/p&gt;&lt;hr size=&quot;1&quot; style=&quot;border-style:solid;&quot;&gt;&lt;p style=&quot;margin:0px;margin-left:4px;&quot;&gt;+ crearTarea()&lt;/p&gt;&lt;p style=&quot;margin:0px;margin-left:4px;&quot;&gt;+ consultarTarea()&lt;/p&gt;&lt;p style=&quot;margin:0px;margin-left:4px;&quot;&gt;+ modificarTarea()&lt;/p&gt;&lt;p style=&quot;margin:0px;margin-left:4px;&quot;&gt;+ eliminarTarea()&lt;/p&gt;&lt;p style=&quot;margin:0px;margin-left:4px;&quot;&gt;+ cambiarEstado()&lt;/p&gt;" vertex="1">
          <mxGeometry height="170" width="160" x="667" y="420" as="geometry" />
        </mxCell>
        <mxCell id="etyIAacoGwPMTgbXiI6D-4" parent="1" style="verticalAlign=top;align=left;overflow=fill;html=1;whiteSpace=wrap;" value="&lt;p style=&quot;margin:0px;margin-top:4px;text-align:center;&quot;&gt;&lt;b&gt;Cliente&lt;/b&gt;&lt;/p&gt;&lt;hr size=&quot;1&quot; style=&quot;border-style:solid;&quot;&gt;&lt;p style=&quot;margin:0px;margin-left:4px;&quot;&gt;+ nombreCliente: String;&lt;/p&gt;&lt;p style=&quot;margin:0px;margin-left:4px;&quot;&gt;+ estadoUsuario: Enum;&lt;/p&gt;&lt;hr size=&quot;1&quot; style=&quot;border-style:solid;&quot;&gt;&lt;p style=&quot;margin:0px;margin-left:4px;&quot;&gt;+ registrarCliente()&lt;/p&gt;&lt;p style=&quot;margin:0px;margin-left:4px;&quot;&gt;+ consultarCliente()&lt;/p&gt;&lt;p style=&quot;margin:0px;margin-left:4px;&quot;&gt;+ modificarCliente()&lt;/p&gt;&lt;p style=&quot;margin:0px;margin-left:4px;&quot;&gt;+ eliminarUsuario()&lt;/p&gt;&lt;p style=&quot;margin:0px;margin-left:4px;&quot;&gt;&lt;br&gt;&lt;/p&gt;" vertex="1">
          <mxGeometry height="140" width="160" x="120" y="420" as="geometry" />
        </mxCell>
        <mxCell id="i7B8Vdsc-NhIerEZa5aG-1" edge="1" parent="1" source="etyIAacoGwPMTgbXiI6D-5" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;entryX=0.5;entryY=0;entryDx=0;entryDy=0;endArrow=none;endFill=0;" target="etyIAacoGwPMTgbXiI6D-4">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        <mxCell id="i7B8Vdsc-NhIerEZa5aG-4" edge="1" parent="1" source="etyIAacoGwPMTgbXiI6D-5" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;entryX=0.5;entryY=0;entryDx=0;entryDy=0;endArrow=none;endFill=0;" target="etyIAacoGwPMTgbXiI6D-2">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        <mxCell id="etyIAacoGwPMTgbXiI6D-5" parent="1" style="verticalAlign=top;align=left;overflow=fill;html=1;whiteSpace=wrap;" value="&lt;p style=&quot;margin:0px;margin-top:4px;text-align:center;&quot;&gt;&lt;b&gt;Usuario&lt;/b&gt;&lt;/p&gt;&lt;hr size=&quot;1&quot; style=&quot;border-style:solid;&quot;&gt;&lt;p style=&quot;margin:0px;margin-left:4px;&quot;&gt;+ nombreUsuario: String;&lt;/p&gt;&lt;p style=&quot;margin:0px;margin-left:4px;&quot;&gt;- claveUsuario: String;&lt;/p&gt;&lt;p style=&quot;margin:0px;margin-left:4px;&quot;&gt;+ estadoUsuario: Enum;&lt;/p&gt;&lt;hr size=&quot;1&quot; style=&quot;border-style:solid;&quot;&gt;&lt;p style=&quot;margin:0px;margin-left:4px;&quot;&gt;+ autenticarUsuario()&lt;/p&gt;&lt;p style=&quot;margin:0px;margin-left:4px;&quot;&gt;+ registrarUsuario()&lt;/p&gt;&lt;p style=&quot;margin:0px;margin-left:4px;&quot;&gt;+ consultarUsuario()&lt;/p&gt;&lt;p style=&quot;margin:0px;margin-left:4px;&quot;&gt;+ modificarUsuario()&lt;/p&gt;&lt;p style=&quot;margin:0px;margin-left:4px;&quot;&gt;+ cambiarEstado()&lt;/p&gt;&lt;p style=&quot;margin:0px;margin-left:4px;&quot;&gt;+ eliminarUsuario()&lt;/p&gt;&lt;p style=&quot;margin:0px;margin-left:4px;&quot;&gt;&lt;br&gt;&lt;/p&gt;" vertex="1">
          <mxGeometry height="180" width="160" x="120" y="120" as="geometry" />
        </mxCell>
        <mxCell id="etyIAacoGwPMTgbXiI6D-9" edge="1" parent="1" source="etyIAacoGwPMTgbXiI6D-13" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;exitX=0.25;exitY=0;exitDx=0;exitDy=0;entryX=-0.012;entryY=0.398;entryDx=0;entryDy=0;entryPerimeter=0;endArrow=none;endFill=0;" target="etyIAacoGwPMTgbXiI6D-2">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="330" y="480" />
              <mxPoint x="330" y="480" />
            </Array>
          </mxGeometry>
        </mxCell>
        <mxCell id="etyIAacoGwPMTgbXiI6D-12" parent="1" style="text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;rounded=0;" value="0.*" vertex="1">
          <mxGeometry height="30" width="60" x="354" y="480" as="geometry" />
        </mxCell>
        <mxCell id="etyIAacoGwPMTgbXiI6D-13" parent="1" style="text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;rounded=0;" value="0.1" vertex="1">
          <mxGeometry height="30" width="60" x="270" y="480" as="geometry" />
        </mxCell>
        <mxCell id="etyIAacoGwPMTgbXiI6D-14" parent="1" style="text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;rounded=0;" value="1.*" vertex="1">
          <mxGeometry height="30" width="60" x="617" y="500" as="geometry" />
        </mxCell>
        <mxCell id="etyIAacoGwPMTgbXiI6D-15" parent="1" style="text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;rounded=0;" value="1.1" vertex="1">
          <mxGeometry height="30" width="60" x="550" y="500" as="geometry" />
        </mxCell>
        <mxCell id="i7B8Vdsc-NhIerEZa5aG-2" parent="1" style="text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;rounded=0;" value="1.*" vertex="1">
          <mxGeometry height="20" width="60" x="140" y="310" as="geometry" />
        </mxCell>
        <mxCell id="i7B8Vdsc-NhIerEZa5aG-3" parent="1" style="text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;rounded=0;" value="1.*" vertex="1">
          <mxGeometry height="30" width="60" x="140" y="390" as="geometry" />
        </mxCell>
        <mxCell id="i7B8Vdsc-NhIerEZa5aG-5" parent="1" style="text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;rounded=0;" value="1.*" vertex="1">
          <mxGeometry height="30" width="60" x="270" y="210" as="geometry" />
        </mxCell>
        <mxCell id="i7B8Vdsc-NhIerEZa5aG-6" parent="1" style="text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;rounded=0;" value="1.*" vertex="1">
          <mxGeometry height="30" width="60" x="480" y="380" as="geometry" />
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>