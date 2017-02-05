<!DOCTYPE HTML>
<%@ Page Language="C#" Debug="true" ClientTarget="uplevel" %>
<%@ import Namespace="MySql.Data.MySqlClient" %>
<%@ import Namespace="System.Data" %>

<script runat="server">

    MySqlConnection dbConnection;
    MySqlDataAdapter dbAdapter;
    MySqlCommand dbCommand;
    DataSet dbDataSet;
    string sqlString;
    DataView dbDataView;

    private void refreshMe() {
        try {
            // Create DataSet and fill with Products table
            dbConnection = new MySqlConnection("Database=rehberga_aspSamples;Data Source=mysql.nscctruro.ca; User Id=rehberga_nsccweb; Password=Normandy2492*");
            dbConnection.Open();
            sqlString = "SELECT * FROM tblGuestbook ORDER BY EntryID DESC";
            dbCommand = new MySqlCommand(sqlString, dbConnection);

            dbAdapter = new MySqlDataAdapter(sqlString, dbConnection);
            dbDataSet = new DataSet();
            dbAdapter.Fill(dbDataSet, "tblGuestbook");

            repDisplay.DataSource = dbDataSet.Tables["tblGuestbook"];
            repDisplay.DataBind();

            sqlString = "SELECT * FROM tblGuestBook";
            dbCommand.CommandText = sqlString;
            Cache["dbDataSet"] = dbDataSet;
        } catch (Exception e) {
            Response.Write("AN ERROR HAS OCCURED: <br/>");
            Response.Write(e.Message);
        } finally {
            dbConnection.Close();
        }
    }

    protected void Page_Load() {
        //refreshMe();
        if (!Page.IsPostBack) {
            //first visit
            refreshMe();
            //chkExpand.Checked = true;
        } else {
            //postback
            if (chkExpand.Checked) {
                slidePanel.Style.Add("display", "block");
            } else {
                slidePanel.Style.Add("display", "none");
            }
            //if (Cache["dbDataSet"] == null) {1
            //    refreshMe();
            //} else {
            //    //this happened                
            //    dbDataSet = (DataSet) Cache["dbDataSet"];
            //}
        }
    }

    protected void submit(Object src, EventArgs args) {
        //ERROR CHECK FOR EMPTY STRING
        if (txtFName.Text == String.Empty) {
            txtFName.Text = "Anonymous";
        }
        if (txtLName.Text == String.Empty) {
            txtLName.Text = "";
        }
        if (txtComment.Text == String.Empty) {
            //txtComment.Style.Add("Color", "red");
            //txtComment.Text = "ENTER A COMMENT!";
            return;
        }

        try {
            dbConnection.Open();
            //------------- parameterize queries---------------
            sqlString = "INSERT INTO tblGuestbook (FirstName, LastName, Comment) VALUES (?FirstName,?LastName,?Comment)";
            dbCommand.CommandText = sqlString;
            //display 
            //error checking for symbols
            dbCommand.Parameters.Add("?FirstName", Server.HtmlEncode(txtFName.Text));
            dbCommand.Parameters.Add("?LastName", Server.HtmlEncode(txtLName.Text));
            dbCommand.Parameters.Add("?Comment", Server.HtmlEncode(txtComment.Text));
            dbCommand.ExecuteNonQuery();

            //interface cleanup
            txtFName.Text = "";
            txtLName.Text = "";
            txtComment.Text = "";
        } finally {
            dbConnection.Close();
        }
        refreshMe();
    }


</script>


<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>Guestbook</title>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <!-- Latest compiled and minified CSS -->
        <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css"/>
        <!-- jQuery library -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
        <!-- Latest compiled JavaScript -->
        <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
        <!-- Character Count plugin -->
        <script src="bootstrap-maxlength.js"></script>

    <script type="text/javascript">
        //PROJECT COLLAPSE AND UNCOLLAPSE
        $(document).ready(function () {            
            $("#chkExpand").click(function () {
                $("#slidePanel").slideToggle("fast");             

                //adding character count
                $('#txtComment').attr('maxLength', '200').maxlength({
                    alwaysShow: true,
                    threshold: 10,
                    warningClass: "label label-info",
                    limitReachedClass: "label label-warning",
                    placement: 'bottom',
                    preText: 'used ',
                    separator: ' of ',
                    postText: ' chars.',
                    validate: true    
                });
            });
        });
        </script>   

</head>
<body style="background-color:steelblue">
    <form runat="server">
        <div class="container">
            <div class="row">
                <div class="col-sm-12">
                    <h2 id="top">Guestbook</h2>
                </div>
            </div>    

            <div class="row">
                <div class="col-sm-12">
                    <label for="chkExpand" id="lblExpand">Expand</label>
                    <asp:Checkbox id="chkExpand" runat="server"/>
                </div>
            </div>
        </div>

        <div class="container">
            <asp:Panel id="slidePanel" class="row" style="display:none; margin-top:20px" runat="server">
                    <div class="form-group">
                        <label for="txtFName">First Name</label>
                        <asp:textbox id="txtFName" CssClass="form-control" placeholder="John" runat="server"/>
                    </div>
                    <div class="form-group">
                        <label for="txtLName">Last Name</label>
                        <asp:textbox id="txtLName" CssClass="form-control" placeholder="Smith" runat="server"/>
                    </div>        
                    <div class="form-group">
                        <label for="txtComment">Comments</label>
                        <asp:textbox id="txtComment" CssClass="form-control" TextMode="MultiLine" rows="5" placeholder="This was great!" runat="server"/>
                    </div>
                    <div class="form-group">
                        <asp:Button id="btnSubmit" CssClass="btn btn-default" OnClick="submit" Text="Submit" runat="server" />
                    </div>
            </asp:Panel>
         </div>

        <div class="row">
            <div class="col-sm-12">
                <asp:repeater id="repDisplay" runat="server">
                    <HeaderTemplate>
                        <table id="repTable" class="table table-striped">
                        <thead>
                            <tr>
                                <td>EntryID</td>
                                <td>FirstName</td>
                                <td>LastName</td>
                                <td>Comment</td>
                                <td>Date</td>
                            </tr>
                        </thead>
                        <tbody>
                    </HeaderTemplate>


                    <ItemTemplate>
                        <tr>
                            <td><%# Eval("EntryID") %></td>
                            <td><%# Eval("FirstName") %></td>
                            <td><%# Eval("LastName") %></td>
                            <td><%# Eval("Comment") %></td>
                            <td><%# Eval("Date") %></td>
                            <td><asp:LinkButton id="btntop" CssClass="btn btn-info" OnClientClick="window.location.href=#top" style="color: black;" Text="Back to Top" runat="server"/></td>
                        </tr>
                    </ItemTemplate>

                    <FooterTemplate>
                            </tbody>
                        </table>
                    </FooterTemplate>
                </asp:repeater>
            </div>
      </div>
    </form>
</body>
</html>
