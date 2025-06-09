using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateVariantSizesStructure : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SizesString",
                table: "Variants");

            migrationBuilder.DropColumn(
                name: "Stock",
                table: "Variants");

            migrationBuilder.AddColumn<string>(
                name: "SizesJson",
                table: "Variants",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SizesJson",
                table: "Variants");

            migrationBuilder.AddColumn<string>(
                name: "SizesString",
                table: "Variants",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Stock",
                table: "Variants",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
